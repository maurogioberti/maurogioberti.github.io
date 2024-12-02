import { BaseRepository } from "./base/BaseRepository";
import { Message } from "../../domain/model/Message";
import { MessageRepository } from "../../domain/repository/MessageRepository";
import { MessageService } from "../../domain/services/MessageService";
import { Automapper } from "@/core/crosscutting/mapping/Automapper";

export class MessageRepositoryImpl extends BaseRepository implements MessageRepository {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    super();
    this.messageService = messageService;
  }

  async getMessage(): Promise<Message> {
    const rawDataMessage =  await this.messageService.fetchMessage();
    return Automapper.map(rawDataMessage, Message);
  }
}