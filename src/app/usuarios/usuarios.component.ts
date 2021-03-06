import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SuiModalService } from 'ng2-semantic-ui';
import { TestService } from '../shared/test.service';
import { ConfirmModal } from '../shared/modal/modal.component';
import { RouterBreadcrumb } from '../helpers/router-breadcrumb';
import { Subscription } from 'rxjs';



export interface IContext {
  data: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [RouterBreadcrumb]
})
export class UsuariosComponent implements OnInit, OnDestroy {    
  public routeBreadcrumb: string;
  
  //variáveis para recuperar dados do usuário a ser excluído
  public id: number;
  public name: string;

  private inscricao: Subscription;
 
  constructor( 
    private router: Router, 
    public modalService: SuiModalService,
    public testService: TestService,
    public RouterBreadcrumb: RouterBreadcrumb
    ) {  
    
    }  

    ngOnInit() { 
      this.inscricao =  this.router.events.subscribe(() => {  
        let url = this.router.url;
        this.routeBreadcrumb = this.RouterBreadcrumb.getUrlBreadCrumb(url);
      });
    }
  
  public openModal() {         
    this.modalService
      .open(new ConfirmModal("Excluir Usuário", `Deseja realmente excluir o usuário ${this.name} ?`))
      .onApprove(() => this.testService.idUsuario(this.id) )
      .onDeny(result => { console.log(result )});

  } 

  //captura  o componente ativo no router-outlet
  onActivate(componentReference) {
    console.log('Componente de referencia: ', componentReference)     
    if(componentReference.excluirUsuario) {
      componentReference.excluirUsuario.subscribe((data) => {         
        this.id = data.id;
        this.name = data.name;         
        this.openModal();         
      })
    }
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
}
