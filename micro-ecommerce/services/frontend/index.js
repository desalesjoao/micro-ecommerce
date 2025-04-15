//funçao para criar e retornar um elemento HTML represetando um produto
function newBook(book) {
    //cria uma div para o livro e adiciona a classe de coluna 
    const div = document.createElement('div');
    div.className = 'colomn is-4';

    //define o conteudo HTML interno da div com dados do livro
   //Define o conteudo HTML interno da div com os dados do livro
   div.innerHTML = `
   <div class="card is-shady">
       <div class="card-image">
           <figure class="image is-4by3">
               <img
                   src="${book.photo}" //imagem do produto
                   alt="${book.name}" //texto alternativo do produto
                   class="modal-button"
               />
           </figure>
       </div>
       <div class="card-content">
           <div class="content book" data-id="${book.id}"> //armazena o ID do Livro
               <div class="book-meta">
                   <p class="is-size-4">R$${book.price.toFixed(2)}</p> //Preço formatado
                   <p class="is-size-6">Disponível em estoque: 5</p> //quantidade ficticia
                   <h4 class="is-size-3 title">${book.name}</h4> //Nome do Produto
                   <p class="subtitle">${book.author}</p> //autor
               </div>
               <div class="field has-addons"> 
                   <div class="control">
                       <input class="input" type="text" placeholder="Digite o CEP"/>
                   </div>
                   <div class="control">
                       <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                   </div>
               </div>
               <button class="button button-buy is-success is-fullwidth">Comprar</button>
           </div>
       </div>
   </div>`;

   //retornar o elemento montado 
   return div
}

//função para calcular o frete com base no id do livro e no CEP 
function calculateShipping(id, cep ) {
    fetch('http://localhost:3000/shipping' + cep) // faz a requissiçao para a api de frete
    .then((data) => {
        if (data.ok) {
            return data.json(); //conveter a resposta para Json se estiver om 
        }
        throw data.statusText; //caso contarrio, lança erro
    })
    .then((data) => {
        // mostra o valor do frete 
        swal('frete', `O frete é: R$${data.value.toFixed(2)}`, 'success')
    })
    .catch((err) => {
        //mostra erro se a requisição falhar 
        swal('erro', 'erro ao consultar frete', 'erro');
        console.error(err);
    });
}

//aguarda o carregameto completo do DOM 
document.addEventListener('DOMContentLoaded', function(){
    const book = document.querySelector('.books'); // selecionar o conteiner onde as livros serão exibidos

    //buscar os produtos (livros) do servidor
    fetch('http://localhsot:3000/products')
     .then((data) =>{
        if (data.ok){
            return data.json(); // convertert a resposta para JSON se estiver ok
        }
        throw data.statusText;
     })
     .then((data) =>{
        if (data) {
            // para cada livro, cria e adiciona o elemnto no conteiner 
            data.forEach ((book) => {
                books.appendChild(newBook(book));
            });

            //adicionar evento de clique aos botões de calcular frete 
            document.querySelectorAll('.button-shipping').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id'); // pega o ID do livro 
                    const cep = document.querySelector(`'.book[data-id="${id}" input`).value; // pega o cep digitado 
                    calculateShipping(id,cep); // chama a função de frete
                });
            });

            //adiciona evento de clique aos botões de compra
            document.querySelectorAll('.button-buy').forEach((btn) => {
                btn.addEventListener('click', (e) =>{
                    swal('compra de livro', 'sua compra foi realizada com sucesso', 'success');
                });
            });
        }
     })
     .catch((err) =>{
        //em caso de erro ao carregar os produtos
        swal('erro', 'Erro ao listar os produtos', 'error');
        console.error(err);
     });
});