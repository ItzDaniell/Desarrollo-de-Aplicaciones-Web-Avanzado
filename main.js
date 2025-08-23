const readline = require('readline');

var tareas = []

var diccionario = {}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

var option = -1

console.log("1: Agregar tarea")
console.log("2: Mostrar tareas pendientes / completadas")

rl.question('Coloque su opción: ', async (input) => {
    option = parseInt(input)
    switch (option){
    case 1:
            console.log("Agregar Tarea")
            const tarea = {id: tareas.length + 1, titulo: "", descripcion: "", categoria: "", estado: "Pendiente"}
            rl.question('Coloque el titulo de la tarea: ', (titulo) => {
                tarea.titulo = titulo
                rl.question('Coloque la descripcion de la tarea: ', (descripcion) => {
                    tarea.descripcion = descripcion
                    rl.question('Coloque la categoria de la tarea: ', (categoria) => {
                        tarea.categoria = categoria
                        tareas.push(tarea)
                        console.log("Tarea agregada correctamente.")
                        rl.close()
                    })
                })
            })
            break;

        case 2:
            if (tareas.length == 0) {
                console.log("No hay tareas para mostrar.")
                rl.close()
            } else {
                rl.question('Coloque el estado de la tarea a mostrar (Pendiente/Completada): ', (estado) => {
                    const filtradas = tareas.filter(tarea => tarea.estado.toLowerCase() === estado.toLowerCase())
                    if (filtradas.length === 0) {
                        console.log("No hay tareas con ese estado.")
                    } else {
                        filtradas.forEach(tarea => {
                            console.log(`ID: ${tarea.id}`)
                            console.log(`Título: ${tarea.titulo}`)
                            console.log(`Descripción: ${tarea.descripcion}`)
                            console.log(`Categoría: ${tarea.categoria}`)
                            console.log(`Estado: ${tarea.estado}`)
                            console.log("-----------------------")
                        })
                    }
                    rl.close()
                })
            }
            break;
        }
    });