import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponenet {
    @Input() message: string;
    @Output() close: EventEmitter<void> = new EventEmitter();

    onClose() {
        this.close.emit();
    }
}