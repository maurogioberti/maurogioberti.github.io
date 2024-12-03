

import { Message } from '../../domain/model/Message';
import { MessageRepository } from '../../domain/repository/MessageRepository';
import { MessageService } from '../../domain/services/MessageService';
import { BaseRepository } from './base/BaseRepository';

export class MessageRepositoryImpl extends BaseRepository implements MessageRepository {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    super();
    this.messageService = messageService;
  }

  async getMessage(): Promise<Message> {
    return await this.messageService.fetchMessage();
  }
}