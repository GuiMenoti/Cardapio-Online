const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutModalBtn = document.getElementById("checkou-modal-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const dateSpan = document.getElementById("date-span")
const addressInputName = document.getElementById("address-name")
const footer = document.getElementById("footer")



let cart = [];


//Abrir Modal
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
   
})

//Fechar Modal
closeModalBtn.addEventListener("click", function () {
    if (confirm("Você deseja realmente fechar o carrinho?")) {
        cartModal.style.display = "none"
    } else {
        cartModal.style.display = "flex"
    }

})

//fechar modal quando clicar fora da tela
cartModal.addEventListener("click", function (event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none"
    }
})



//items do menu
menu.addEventListener("click", function (event) {
    // console.log (event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        Toastify({
            text: "Pedido adicionado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#00FF00",
              color: "black",
            }, 
          }).showToast();
        addToCart(name, price)
        footer.classList.remove("hidden")
    }
    //parsefloat usar numero (number)
})


//função para adicionar no carrinho

function addToCart(name, price) {
    //buscando dentro da lista sem tem nome repetido
    const existingItem = cart.find (item => item.name === name )

    if(existingItem) {
        //se o item já existe, aumenta a quantidade em + 1
        existingItem. quantity += 1;
        
    }else {

        cart.push({
            name,
            price,
            quantity: 1,
        })
       
    }
    updateCartModal()
    }
   


//function atualiza o carrinho

function updateCartModal() {
   cartItemsContainer.innerHTML = "";
   let total = 0;

   cart.forEach(item => {
    const cartItemsElement = document.createElement("div");
    cartItemsElement.classList.add("flex","justify-between", "mb-4", "flex-col")

    cartItemsElement.innerHTML = `
<div class="flex items-center justify-between"> 
    <div>
        <p class="font-bold">${item.name}</p>
        <p class="underline decoration-solid">Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
        </div>
          <button class="btn-remove bg-gray-200 rounded px-3  " data-name="${item.name}">
          Remover
          </button>
       
    </div>
     `

     total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemsElement);
    
   })
//   ADICIONA O TOTAL NO MODAL JÁ FORMATADO EM REAL
   cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
   });

   // ADICIONA A QUANTIDADE DE ITENS NO CARD DO CARRINHO
   cartCounter.innerHTML = cart.length;
}



//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if (event.target.classList.contains("btn-remove")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index,1);
        updateCartModal();
    }
}



//Input Erro Endereço
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== ""){
        addressInput.classList.remove("border-red-600")
        addressWarn.classList.add("hidden")
    }

})

//Input Erro Name
addressInputName.addEventListener("input", function(event) {
    let inputValueName = event.target.value;

    if (inputValueName !== ""){
        addressInputName.classList.remove("border-red-600")
        addressWarnName.classList.add("hidden")
    }

})


//finalizar Pedido
checkoutModalBtn.addEventListener("click", function(){
     //verificação restaurante fechado
    // const isOpen = checkRestauranteOpen();
    // if (!isOpen) {
    //     Toastify({
    //         text: "Ops o Restaurante está fechado!",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", 
    //         position: "right", 
    //         stopOnFocus: true, 
    //         style: {
    //           background: "#ef4444",
    //         }, 
    //       }).showToast();
    //     return;
    // }

    if (cart.length === 0) {
        Toastify({
            text: "Você precisa adicionar algum produto ao seu carrinho!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            }, 
          }).showToast();
        return;
    };

    if(addressInput.value === "") {
        addressWarn.classList.remove ("hidden")
        addressInput.classList.add("border-red-600")
        return;
    }

 //Enviar o pedido para a Api do WhatsApp
    const cartItems = cart.map((item)=> {
        return (
           ` ${item.name} Quantidade:(${item.quantity}) Preço: R$${item.price} |`
        )

    }).join ("")

   const message = encodeURIComponent(cartItems)
   const phone = "11940382338"

   window.open(`https://wa.me/${phone}? text=${message} Endereço: ${addressInput.value} Nome: ${addressInputName.value}`, "_blank")
   console.log(addressInputName.value);

   cart.length = 0;
   updateCartModal();
})





//verificar a hora e manipular o card horario
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const dateSpann = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if (isOpen) {
    dateSpann.classList.remove ("bg-red-500");
    dateSpann.classList.add ("bg-green-600")}
 else {
        dateSpann.classList.remove("bg-green-600");
        dateSpann.classList.add ("bg-red-500");
    }
