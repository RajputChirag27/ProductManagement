import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChatRoutingModule } from './chat-routing.module'
import { ChatComponent } from './chat.component'
import { ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'ngx-markdown'
import * as MarkdownIt from 'markdown-it'

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
  ]
})
export class ChatModule {}
