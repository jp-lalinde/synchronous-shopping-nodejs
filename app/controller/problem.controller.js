/*
    Solución del algoritmo utilizando como base Dijkstra.
 */
exports.solve = (req, res) => {
    //Se define el valor  de infinito
    const INF = 100000000000000;
    //Variables de prueba para autenticación
    const user = 'taximo_api_user';
    const pw = 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796';
    //Se definen la variables de loops
    var i, j;
    if(req.body.username==user && req.body.checksum==pw)
    {
        try {
            //Se verifica que los datos ingresados no existan en la base de datos. Si existen, retornan  la respuesta.
            
            //Se obtienen los parámetros del post
            var parameters = req.body.parameters.split(",");
            var shopping_centers = req.body.shopping_centers.split("-");
            for(i=0; i<shopping_centers.length;i++){
                shopping_centers[i] = shopping_centers[i].split(",");
            }
            var roads = req.body.roads.split("-");
            for(i=0; i<roads.length;i++){
                roads[i] = roads[i].split(",");
            }
            //Se obtienen los valores de N, M  y K TODO Obtener de parametros
            var N = parseInt(parameters[0], 10);
            var M = parseInt(parameters[1], 10);
            var K = parseInt(parameters[2], 10);
            //Se inicializa el valor objetivo de peces cumulativos en binario, dependiendo de la cantidad de tipos de peces
            var fish_result = Math.pow(2, K) - 1
            //Se inicializa la matriz de distancias con infinito.
            var distances = new Array();
    
            for (i = 0; i < N; i++) {
                distances[i] = new Array();
                for (j = 0; j < Math.pow(2, K); j++) {
                    distances[i][j] = INF;
                };
            };
    
            //Se inicializa la matriz con los tipos de peces, para cada nodo i en N.
            var fish_distribution = new Array();
            for(i=0;i<N;i++){
                fish_distribution[i] = new Array();
                for(j=1; j<shopping_centers[i].length;j++){
                    fish_distribution[i][j-1] = parseInt(shopping_centers[i][j], 10);
                }
            }
    
            //Se inicializa una matriz de conversión binario -> decimal
            var binary_to_decimal = [
                1,
                2,
                4,
                8,
                16,
                32,
                64,
                128,
                256,
                512
            ];
            //Se crea una matriz con el valor agregado de los peces en cada nodo, en binario
            var final_fish_distribution = [];
            for (i = 0; i < fish_distribution.length; i++) {
                var fish = 0;
                for (j = 0; j < fish_distribution[i].length; j++) {
                    var current_fish = fish_distribution[i][j];
                    fish = fish | binary_to_decimal[current_fish - 1];
                }
                final_fish_distribution.push(fish);
            }
            //Se inicializa la matriz con los nodos a visitar
            var nodes_to_visit = [];
    
            //Se inicializa la matriz con los arcos (bidireccionales) y distancias
            var road_distances = new Array(N);
            for(i=0; i<N; i++){
                road_distances[i] = [];
            };
            for(i=0; i<M; i++){
                var index = parseInt(roads[i][0], 10);
                var tuple = [parseInt(roads[i][1], 10), parseInt(roads[i][2], 10)];
                road_distances[index-1].push(tuple);
                index = parseInt(roads[i][1], 10);
                tuple = [parseInt(roads[i][0], 10), parseInt(roads[i][2], 10)];
                road_distances[index-1].push(tuple);
            };
    
            //Push del primer nodo a visitar, en este caso nodo 1. Adicionalmente se guarda la distancia hasta el nodo y los peces recolectados en binario.
            var initial_fish = final_fish_distribution[0];
            nodes_to_visit.push([0, [1, initial_fish]]);
            //Se actualiza la matriz de distancias para el nodo 1 (fila 0), en la columna initial_fish-1
            distances[0][initial_fish - 1] = 0;
            //Loop principal, cuya condición de terminación es que no existan más elementos en el conjunto de nodos a visitar
            while (nodes_to_visit.length > 0) {
                //Asigno el nodo actual, los peces actuales, y saco el nodo actual de la lista de nodos a visitar
                var initial_node = nodes_to_visit[0][1][0];
                var initial_fish = nodes_to_visit[0][1][1];
                nodes_to_visit.shift();
                //Loop para meter nodos a visitar, dado que sean adyacentes al nodo actual y que no se encuentren ya en la lista.
                for (i = 0; i < road_distances[initial_node - 1].length; i++) {
                    //El nodo adyacente actual
                    var current_node = road_distances[initial_node - 1][i][0];
                    //La cantidad de peces cumulativa, dado que se viaje a este nodo
                    var current_fish = initial_fish | final_fish_distribution[current_node - 1];
                    //La distancia cumulativa, dado que se viaje a este nodo
                    var current_distance = distances[initial_node - 1][initial_fish - 1] + road_distances[initial_node - 1][i][1];
                    //Si la distancia cumulativa es mayor a la distancia guardada en la matriz de distancias, para ese nodo y combinación de peces, pasar a la siguiente iteración
                    if (distances[current_node - 1][current_fish - 1] <= current_distance) {
                        continue;
                    };
                    //Guardo la nueva distancia en la matriz de distancias
                    var o = current_node - 1;
                    var p = current_fish - 1;
                    distances[o][p] = current_distance;
                    //Se construye la tupla a guardar en el arreglo de nodos por visitar
                    var node_tuple = [road_distances[initial_node - 1][i][1],
                        [current_node, current_fish]
                    ];
    
                    //Si la tupla ya esta en nodos por visitar, quitarla. De lo contrario, agregarla.
                    var found = false;
                    for (j = 0; j < nodes_to_visit.length; j++) {
                        if ((nodes_to_visit[j][0] === node_tuple[0]) && (nodes_to_visit[j][1][0] === node_tuple[1][0]) && (nodes_to_visit[j][1][1] === node_tuple[1][1])) {
                            nodes_to_visit.splice(j, 1);
                            found = true;
                            break;
                        };
                    };
                    if (!found) {
                        nodes_to_visit.push(node_tuple);
                    };
                }
            }
    
            //Se inicializa una variable con valor infinito, en la cual se guardará la respuesta
            var answer = INF;
            //Se recorre la ultima fila de la matriz de distancias, y se guarda en answer el minmax de aquellas tuplas de rutas que cumplan el objetivo de recoger todos los peces. 
            for (i = 1; i < distances[N - 1].length; i++) {
                for (j = i; j < distances[N - 1].length; j++) {
                    var fishA = i + 1;
                    var fishB = j + 1;
                    currentFish = fishA | fishB;
                    if (currentFish === fish_result) {
                        answer = Math.min(answer, Math.max(distances[N - 1][i], distances[N - 1][j]));
                    }
                }
            }
    
            //Retorna la respuesta en formato JSON
            res.status(200).json({
                minimum_time: answer.toString()
            });
        } catch (err) {
            res.status(500).json({msg: 'Error al procesar la respuesta, verifique que los parámetros tengan el formato adecuado.',
                                  error: err});
        }
    }
    else{
        res.status(401).json({msg: 'Acceso no autorizado'});
    }
};