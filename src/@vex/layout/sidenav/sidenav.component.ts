import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../config/config.service';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';
import { NavigationLink } from '../../interfaces/navigation-item.interface';
import { PopoverService } from '../../components/popover/popover.service';
import { Observable, of } from 'rxjs';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';




import { FormControl } from '@angular/forms';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, AfterViewInit {
  searchFilter: FormControl = new FormControl('')

  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));
  userVisible$ = this.configService.config$.pipe(map(config => config.sidenav.user.visible));
  userMenuOpen$: Observable<boolean> = of(false);
  items: any;

  constructor(private navigationService: NavigationService,
    private layoutService: LayoutService,
    private commonService: CommonService,
    private localstorageService: LocalstorageService,
    private configService: ConfigService,
    private readonly popoverService: PopoverService) {
  }

  ngOnInit() {
    this.filterSideBarMenu();
  }

  ngAfterViewInit() {
    let formValue = this.searchFilter.valueChanges;
    formValue.pipe(
      filter(() => this.searchFilter.valid),
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((res) => {
        this.filterSideBarMenu(this.localstorageService.getAllPageName(), res.toLowerCase())
      })
  }

  filterSideBarMenu(pageList?: [], val?: string) {
    if (this.commonService.checkDataType(val) == false) {
      this.moduleConArray(this.localstorageService.getAllPageName());
      return
    }
    let obsPageList = of(pageList);
    const data = obsPageList.pipe(
      map(pages => pages.filter((ele: string) =>
        (ele['pageName']?.toLowerCase().includes(val) || ele['module'].toLowerCase().includes(val)) && ele['isSideBarMenu'] == true)));
    data.subscribe((res: []) => {
      this.moduleConArray(res);
    })
  }


  moduleConArray(data: []) {
    let loginPages = [];
    data.find((item: any) => {
      let existing: any = loginPages.filter((v: any) => {
        return v.module == item.module;
      });
      if (existing.length) {
        let existingIndex: any = loginPages.indexOf(existing[0]);
        loginPages[existingIndex].pageURL = loginPages[existingIndex].pageURL.concat(item.pageURL);
        loginPages[existingIndex].pageName = loginPages[existingIndex].pageName.concat(item.pageName);
      } else {
        if (typeof item.pageName == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        loginPages.push(item);
      }
    });
    this.sideBarMenuList(loginPages);
  }

  sideBarMenuList(data) {
    let pageDataTransform = data;
    pageDataTransform.map((ele: any) => {
      if (ele.isSideBarMenu == true) {
        if (ele.pageURL.length > 1) {
          ele['type'] = 'dropdown',
            ele['label'] = ele?.module,
            ele['icon'] = ele?.menuIcon
          ele['children'] = [];
          ele.pageURL.find((item: any, i: any) => {
            ele['children'].push(
              {
                type: 'link',
                label: ele?.pageName[i],
                route: item
              })
          })
        } else {
          ele['type'] = 'link',
            ele['label'] = ele?.pageName,
            ele['route'] = '/' + ele?.pageURL,
            ele['icon'] = ele?.menuIcon
        }
        return ele
      }
    })
    this.navigationService.items = pageDataTransform;
    this.items = this.navigationService.items;
  }


  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }

  trackByRoute(_index: number, item: NavigationLink): string {
    return item.route;
  }

  openProfileMenu(origin: HTMLDivElement): void {
    this.userMenuOpen$ = of(
      this.popoverService.open({
        content: UserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        position: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          }
        ]
      })
    ).pipe(
      switchMap(popoverRef => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true),
    );
  }
}
