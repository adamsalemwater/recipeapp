import { Directive, ElementRef, HostBinding, HostListener, Input } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
   @HostBinding('class.open') open = false;

 @HostListener('document:click', ['$event']) show(toggle:Event) {
    this.open = this.elRef.nativeElement.contains(toggle.target) ?
    !this.open: false;
 }

 constructor(private elRef: ElementRef) {}
}