import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-form-card',
  standalone: true,
  imports: [],
  templateUrl: './add-new-form-card.component.html',
  styleUrl: './add-new-form-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewFormCardComponent {
  @Input() disabled: boolean = false;

  @Output() create = new EventEmitter<void>();

  emitCreateEvent(): void {
    this.create.emit();
  }
}
