import { Component, HostListener, HostBinding, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { NotificationType } from '../../models/notificationType.model';
import { NotificationIcon } from '../../models/notificationIcon.model';
import { RowNotification } from '../../models/rowNotification.model';
import { ActionPanelJqeuryHelper } from './actionPanelJqueryHelper';

@Component({
    templateUrl: './action-panel.component.html',
    selector: 'vgr-action-panel',
    moduleId: module.id
})
export class ActionPanelComponent implements OnInit, AfterContentInit {
    // För att kunna binda till Enum värde i markup
    public NotificationIcons = NotificationIcon;

    readonly showNotificationDurationMs = 1500;
    private actualContentHeight: string;
    private pageHeaderHeight: number;
    @HostBinding('class.action-panel') isContainer = true;
    @HostBinding('class.action-panel--collapsed') collapsed = true;
    @HostBinding('class.action-panel--expanded') private _expanded: boolean;
    @HostBinding('class.action-panel--deleted') deleted: boolean;
    @HostBinding('class.action-panel--notification-visible') notificationVisible: boolean;
    @HostBinding('class.action-panel--not-interactable') notInteractable: boolean;

    @Input() title: string;
    @Input() expansionSpeed: 'slow' | 'normal' | 'fast';
    get animationDelayMs(): number {
        return this.expansionSpeed === 'slow' ? 1000 :
            this.expansionSpeed === 'fast' ? 300 : 600;

    }
    @HostBinding('class.action-panel--slow') get slow() {
        return this.expansionSpeed === 'slow';
    }
    @HostBinding('class.action-panel--fast') get fast() {
        return this.expansionSpeed === 'fast';
    }

    @Input() set expanded(expandedValue: boolean) {
        if (expandedValue && !this._expanded) {
            this.expand();
        } else if (!expandedValue && this._expanded) {
            this.collapse();
        }
    }
    get expanded(): boolean {
        return this._expanded;
    }
    @Output() expandedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() notificationChanged: EventEmitter<RowNotification> = new EventEmitter<RowNotification>();

    private _notification: RowNotification;
    @Input() set notification(value: RowNotification) {
        this._notification = value;
        if (value) {
            if (value.type === NotificationType.ShowOnCollapse) {
                this.collapse(value.type);
                this.changeDetecor.detectChanges();
            } else if (value.type === NotificationType.ShowOnRemove) {
                this.collapse(value.type);
                this.changeDetecor.detectChanges();
            } else if (value.type === NotificationType.Permanent) {
                this.showNotification();
            }
        }
        this.notificationChanged.emit(value);
    }
    get notification(): RowNotification {
        return this._notification;
    }

    constructor(private elementRef: ElementRef, private changeDetecor: ChangeDetectorRef, private jqueryHelper: ActionPanelJqeuryHelper) {
        this.pageHeaderHeight = 0;
    }

    ngAfterContentInit() {
        this.updateActualContentHeight();
    }

    private updateActualContentHeight() {
        this.actualContentHeight = this.elementRef.nativeElement.scrollHeight + 'px';
    }

    public setPageHeaderHeight(height: number) {
        this.pageHeaderHeight = height;
        this.elementRef.nativeElement.style.top = height + 'px';
    }

    ngOnInit() {
        if (this.notification && this.notification.type === NotificationType.Permanent) {
            this.showNotification();
        }
    }

    showNotification() {
        this.notificationVisible = true;
    }

    private expand() {
        if (this.deleted || this.notInteractable) {
            return;
        }
        this.updateActualContentHeight();
        this.elementRef.nativeElement.style.height = this.actualContentHeight;
        this._expanded = true;
        this.collapsed = false;

        this.expandedChanged.emit(this._expanded);
        setTimeout(() => {
            this.elementRef.nativeElement.style.height = 'auto';
        }, this.animationDelayMs);

    }

    private collapse(collapsingNotification?: NotificationType) {
        this.updateActualContentHeight();
        this.elementRef.nativeElement.style.height = this.actualContentHeight;
        setTimeout(() => {
            this.elementRef.nativeElement.style.height = '0px';
            this._expanded = false;
            this.collapsed = true;
        }, 50);


        // if (collapsingNotification) {
        //     this.processNotification(collapsingNotification, () => {

        //     });
        // } else {
        //     this.jqueryHelper.collapseContent(this.elementRef, () => {
        //         this._expanded = false;
        //         this.collapsed = true;
        //         this.notInteractable = false;
        //         this.expandedChanged.emit(this._expanded);
        //     }, this.expandingDuration);
        // }
    }

    private processNotification(notificationType: NotificationType, callback: Function): void {
        if (notificationType === NotificationType.ShowOnCollapse) {
            this.processShowOnCollapseNotification(callback);
        } else if (notificationType === NotificationType.ShowOnRemove) {
            this.processShowOnRemoveNotification(callback);
        };
    }

    private processShowOnCollapseNotification(callback: Function) {
        this.notificationVisible = true;
        // setTimeout(() => {
        //     this.jqueryHelper.collapseContent(this.elementRef, () => {
        //         this._expanded = false;
        //         this.collapsed = true;
        //         this.expandedChanged.emit(this._expanded);
        //         setTimeout(() => {
        //             this.notification.done = true;
        //             this.notificationVisible = false;
        //             this.notInteractable = false;
        //         }, 2000)
        //     }, this.expandingDuration);
        // }, 1400);

    }

    private processShowOnRemoveNotification(callback: Function) {
        this.notificationVisible = true;
        // setTimeout(() => {
        //     this.jqueryHelper.collapseContent(this.elementRef, () => {
        //         this._expanded = false;
        //         this.collapsed = true;
        //         this.expandedChanged.emit(this._expanded);
        //         setTimeout(() => {
        //             this.notification.done = true;
        //             this.notificationVisible = false;
        //             this.notInteractable = false;
        //             this.deleted = true;
        //         }, 2000)
        //     }, this.expandingDuration);
        // }, 1400);
    }
}
