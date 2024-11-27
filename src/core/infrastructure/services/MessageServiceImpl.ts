import { BaseService } from "./base/BaseService";
import { MessageService } from "../../domain/services/MessageService";
import { Message } from "../../domain/model/Message";
import fs from "fs/promises";
import path from "path";

export class MessageServiceImpl extends BaseService implements MessageService {
  private static readonly MESSAGE_FILE_PATH = path.resolve(
    process.cwd(),
    "src/data/message.json"
  ); //TODO: Move base path to base service class

  //TODO: Move to base class
  async fetchMessage(): Promise<Message> {
    try {
      const fileContent = await fs.readFile(MessageServiceImpl.MESSAGE_FILE_PATH, "utf-8");
      const data: Message = JSON.parse(fileContent); 
      return data;
    } catch (error) {
      console.error("Error reading message.json:", error);
      throw new Error("Could not read message.json");
    }
  }
}
