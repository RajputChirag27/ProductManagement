import { Component, OnInit } from '@angular/core'
import { GenerativeaiService } from 'src/app/core/services/generativeai.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// import 'prismjs';
// import 'prismjs/components/prism-typescript.min.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
// import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatHistory: string[] = []
  chatForm!: FormGroup
  loading: boolean = false

  constructor(
    private generativeAIService: GenerativeaiService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.chatForm = this.fb.group({
      userInput: ['', Validators.required]
    })

    this.generativeAIService.startChat().subscribe(
      response => {
        const markdownResponse = this.formatAIResponse(response)
        this.chatHistory.push('AI: ' + markdownResponse)
      },
      error => {
        console.error(error)
      }
    )
  }

  onSubmit() {
    if (this.chatForm.invalid) {
      return
    }

    const userInput = this.chatForm.get('userInput')?.value
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!')
      return
    }

    this.chatHistory.push('You: ' + userInput)
    this.chatForm.get('userInput')?.reset()

    this.loading = true
    this.generativeAIService.sendMessage(userInput).subscribe(
      response => {
        this.chatHistory.push('AI: ' + response)
        this.loading = false
      },
      error => {
        console.error(error)
        this.loading = false
      }
    )
  }

  getMessageClass(message: string): any {
    return {
      'ai-message': message.startsWith('AI:'),
      'user-message': !message.startsWith('AI:')
    }
  }

  formatAIResponse(message: string): string {
   // Basic Markdown formatting for Gemini AI responses
    // Customize this based on specific Gemini AI response structures and desired output format

    // Handle code blocks
    message = message.replace(/```(.*)```/g, '```$1```');

    // Handle headings (adjust levels as needed)
    message = message.replace(/^# (.*)/gm, '## $1');
    message = message.replace(/^## (.*)/gm, '### $1');

    // Handle lists
    message = message.replace(/^\* (.*)/gm, '* $1');

    // Handle bold and italics
    message = message.replace(/\*\*(.*)\*\*/g, '**$1**');
    message = message.replace(/\_(.*)\_/g, '*$1*');

    // Handle links
    message = message.replace(/\[(.*)\]\((.*)\)/g, '[$1]($2)');

    // Other formatting options as needed (e.g., quotes, inline code, etc.)

    return message;
  }
}
