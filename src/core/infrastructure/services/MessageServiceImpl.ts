import { BaseService } from "./base/BaseService";
import { MessageService } from "../../domain/services/MessageService";
import { Message } from "../../domain/model/Message";

export class MessageServiceImpl extends BaseService implements MessageService {
  private static readonly MESSAGE_API_URL: string= "/static/message.json";

  async fetchMessage(): Promise<Message> {
    const response = await fetch(MessageServiceImpl.MESSAGE_API_URL);
    const data: Message = await response.json();
    return data;
  }
}