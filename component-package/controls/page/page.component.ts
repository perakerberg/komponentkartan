import { Component, Input, EventEmitter, Output, AfterContentInit, AfterViewInit, ContentChild, ViewChild, HostBinding, HostListener, ElementRef } from '@angular/core';
import { PageHeaderComponent } from '../pageHeader/pageHeader.component';
import { PageBodyComponent } from '../page-body/page-body.component';
import { ActionPanelComponent } from '../action-panel/action-panel.component';

@Component({
    selector: 'vgr-page',
    moduleId: module.id,
    templateUrl: './page.component.html'
})
export class PageComponent implements AfterContentInit, AfterViewInit {
    @HostBinding('class.page') hasClass = true;
    @ContentChild(PageHeaderComponent, { read: ElementRef }) pageHeader: ElementRef;
    @ContentChild(PageBodyComponent, { read: ElementRef }) pageBody: ElementRef;
    @ContentChild(ActionPanelComponent) actionPanelComponent: ActionPanelComponent;

    ngAfterContentInit() {
        this.updateComponentHeights();
    }

    ngAfterViewInit() {
        this.updateComponentHeights();
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: Event) {
        this.updateComponentHeights();
    }

    private updateComponentHeights() {
        const pageHeaderHeight = this.getPageHeaderHeight();
        if (this.pageBody) {
            this.pageBody.nativeElement.style.top = pageHeaderHeight + 'px';
        }
        if (this.actionPanelComponent) {
            this.actionPanelComponent.setPageHeaderHeight(pageHeaderHeight);
        }
    }

    private getPageHeaderHeight() {
        return this.pageHeader ? this.pageHeader.nativeElement.offsetHeight : 0;
    }

}
