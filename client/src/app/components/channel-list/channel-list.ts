import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent implements OnInit {
  channels: Channel[] = [];

  constructor(private channelService: ChannelService) {}

  ngOnInit() {
    this.channels = this.channelService.getChannels(); // 初始加载本地数据
  }

  joinChannel(channelId: string) {
    this.channelService.joinChannel(channelId, 'userId').subscribe(
      (channel) => console.log('Joined channel:', channel)
    );
  }
}