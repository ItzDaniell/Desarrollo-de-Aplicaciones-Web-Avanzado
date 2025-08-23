const readline = require('readline');

var tareas = []

var diccionario = {}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function mostrarMenu() {
    console.log("\n1: Agregar tarea")
    console.log("2: Mostrar tareas pendientes / completadas")
    console.log("3: Marcar tarea como completada")
    console.log("4: Listar por categoria")
    console.log("0: Salir")
}

function preguntarOpcion() {
    mostrarMenu()
    rl.question('Coloque su opción: ', (input) => {
        const option = parseInt(input)
        switch (option){
            case 1:
                console.log("Agregar Tarea")
                const tarea = {id: tareas.length + 1, titulo: "", descripcion: "", categoria: "", estado: "Pendiente"}
                rl.question('Coloque el titulo de la tarea: ', (titulo) => {
                    tarea.titulo = titulo
                    rl.question('Coloque la descripcion de la tarea: ', (descripcion) => {
                        tarea.descripcion = descripcion
                        rl.question('Coloque la categoria de la tarea (Estudio, Trabajo, Personal): ', (categoria) => {
                            tarea.categoria = categoria
                            tareas.push(tarea)
                            diccionario[categoria] = diccionario[categoria] || []
                            diccionario[categoria].push(tarea)
                            console.log("Tarea agregada correctamente.")
                            preguntarOpcion()
                        })
                    })
                })
                break;

            case 2:
                if (tareas.length == 0) {
                    console.log("No hay tareas para mostrar.")
                    preguntarOpcion()
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
                        preguntarOpcion()
                    })
                }
                break;

            case 3:
                if (tareas.length === 0) {
                    console.log("No hay tareas para marcar como completadas.")
                    preguntarOpcion()
                } else {
                    rl.question('Coloque el ID de la tarea a marcar como completada: ', (id) => {
                        const tarea = tareas.find(t => t.id === parseInt(id))
                        if (!tarea) {
                            console.log("Tarea no encontrada.")
                        } else {
                            tarea.estado = "Completada"
                            console.log("Tarea marcada como completada.")
                        }
                        preguntarOpcion()
                    })
                }
                break;

            case 4:
                if (Object.keys(diccionario).length === 0) {
                    console.log("No hay tareas por categoría.")
                    preguntarOpcion()
                } else {
                    rl.question('Coloque la categoría a listar: ', (categoria) => {
                        if (!diccionario[categoria]) {
                            console.log("No hay tareas en esa categoría.")
                        } else {
                            console.log(`Tareas en la categoría "${categoria}":`)
                            diccionario[categoria].forEach(tarea => {
                                console.log(`  ID: ${tarea.id}`)
                                console.log(`  Título: ${tarea.titulo}`)
                                console.log(`  Descripción: ${tarea.descripcion}`)
                                console.log(`  Estado: ${tarea.estado}`)
                            })
                        }
                        preguntarOpcion()
                    })
                }
                break;

            case 0:
                console.log("Saliendo...")
                rl.close()
                break;

            default:
                console.log("Opción no válida")
                preguntarOpcion()
        }
    })
}

preguntarOpcion()