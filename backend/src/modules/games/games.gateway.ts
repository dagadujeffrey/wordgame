import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamesService } from './games.service';
import { PlaceLetterDto } from './dto/place-letter.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway {
  private readonly logger = new Logger(GamesGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly gamesService: GamesService) {}

  @SubscribeMessage('join-room')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string }) {
    this.logger.log(`Socket ${client.id} joining room ${body.roomId}`);
    client.join(body.roomId);
    const game = this.gamesService.getGame(body.roomId);
    client.emit('state-updated', game);
    return { status: 'ok' };
  }

  @SubscribeMessage('place-letter')
  handlePlace(@MessageBody() dto: PlaceLetterDto) {
    const updatedGame = this.gamesService.placeLetter(dto.gameId, dto.playerId, dto.row, dto.column, dto.letter);
    this.server.to(dto.gameId).emit('state-updated', updatedGame);
    return updatedGame;
  }
}
