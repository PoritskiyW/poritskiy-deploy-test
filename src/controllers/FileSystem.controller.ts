import * as fs from "fs/promises";
import * as rimraf from "rimraf";

export class FileSystemController {
  public async moveImages(
    files: Array<Express.Multer.File>,
    id: string,
    exists: boolean
  ): Promise<Array<string>> {
    try {
      const directoryPath = `public/images/${id}`;
      let images: Array<string> = [];
      let index = 0;
      if (exists) {
        const readedFiles = await fs.readdir(`public/images/${id}`);
        index = readedFiles.length;
      } else {
        await fs.mkdir(directoryPath);
      }

      for (const item of files) {
        const fileName = await this.moveImage(item, directoryPath, id, index);
        images.push(fileName.replace("public", ""));
        index++;
      }

      return images;
    } catch (err) {
      console.error(err);
    }
  }

  public async cleanImages(files: Array<string>, id: string): Promise<void> {
    try {
      let filesArray = [];
      files.forEach((file) => {
        filesArray.push(file.replace(`images/${id}`, "").replace("//", ""));
      });
      const readedFiles = await fs.readdir(`public/images/${id}`);
      readedFiles.forEach((file) => {
        if (!filesArray.includes(file)) {
          fs.unlink(`public/images/${id}/${file}`);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  public async deleteFolder(id: string): Promise<void> {
    rimraf.default(`public/images/${id}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  private async moveImage(
    image: Express.Multer.File,
    directoryPath: string,
    id: string,
    index: number
  ): Promise<string> {
    try {
      const file = await fs.readFile(image.path);
      const splitString = image.originalname.split(".");
      const extname = "." + splitString[splitString.length - 1];
      const destinationFile = directoryPath + "/" + id + index + extname;
      await fs.writeFile(destinationFile, file);
      await fs.unlink(image.path);
      return destinationFile;
    } catch (err) {
      console.error(err);
    }
  }
}
