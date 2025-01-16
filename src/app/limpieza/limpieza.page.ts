import { Component } from '@angular/core';

@Component({
  selector: 'app-limpieza',
  templateUrl: 'limpieza.page.html',
  styleUrls: ['limpieza.page.scss'],
})
export class LimpiezaPage {
  selectedGroup: { 
    category: string, 
    name: string, 
    professor: string, 
    cleaner: string,
    tasks: { taskName: string, assignees: string[] }[] 
  } | null = null;

  // Función para seleccionar el grupo y mostrar los detalles
  selectGroup(category: string, groupName: string) {
    let groupDetails = null;  // Inicializamos groupDetails como null

    // Detalles para "Grado Medio"
    if (category === 'Grado Medio') {
      if (groupName === '2PCC1') {
        groupDetails = {
          category: 'Grado Medio',
          name: '2PCC1',
          professor: 'Profesor Juan Pérez',
          cleaner: 'Carlos González',
          tasks: [
            { taskName: 'Recogida de Colada', assignees: ['Pedro García', 'Sofia Ruiz'] },
            { taskName: 'Puesta de Lavadora', assignees: ['Ana Martínez', 'Carlos González'] },
            { taskName: 'Tender la Colada', assignees: ['Luis Romero', 'María Pérez'] }
          ]
        };
      } else if (groupName === '2PCC2') {
        groupDetails = {
          category: 'Grado Medio',
          name: '2PCC2',
          professor: 'Profesora María López',
          cleaner: 'Ana Martínez',
          tasks: [
            { taskName: 'Recogida de Colada', assignees: ['Luis Torres', 'Elena Sánchez'] },
            { taskName: 'Puesta de Lavadora', assignees: ['Pedro Torres', 'Laura Gómez'] },
            { taskName: 'Tender la Colada', assignees: ['Raúl Jiménez', 'Carmen Díaz'] }
          ]
        };
      }
    }
    
    // Detalles para "Grado Superior"
    else if (category === 'Grado Superior') {
      if (groupName === '3EDP1') {
        groupDetails = {
          category: 'Grado Superior',
          name: '3EDP1',
          professor: 'Profesor Pedro Sánchez',
          cleaner: 'Luis Romero',
          tasks: [
            { taskName: 'Recogida de Colada', assignees: ['Juan Martín', 'Pablo López'] },
            { taskName: 'Puesta de Lavadora', assignees: ['Marta Díaz', 'Luis Romero'] },
            { taskName: 'Tender la Colada', assignees: ['Elena Pérez', 'Pedro Torres'] }
          ]
        };
      } else if (groupName === '3EDP2') {
        groupDetails = {
          category: 'Grado Superior',
          name: '3EDP2',
          professor: 'Profesora Laura Gómez',
          cleaner: 'Pedro Torres',
          tasks: [
            { taskName: 'Recogida de Colada', assignees: ['Carlos García', 'Sofia López'] },
            { taskName: 'Puesta de Lavadora', assignees: ['Raúl Torres', 'Laura Gómez'] },
            { taskName: 'Tender la Colada', assignees: ['María Ruiz', 'Javier González'] }
          ]
        };
      }
    }

    // Asegurarse de que groupDetails tiene un valor antes de asignarlo
    if (groupDetails) {
      this.selectedGroup = groupDetails;
      console.log("Grupo seleccionado:", this.selectedGroup); // Para mostrar en la consola el grupo seleccionado
    } else {
      console.error("No se encontraron detalles para el grupo seleccionado.");
    }
  }
}
