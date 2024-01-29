Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
  })



Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <span style="color: red; font-size: 30px" v-show='onSale'>{{onSaleText}}          </span>

            <span style="color: #1E95EA; font-size: 30px" v-if="inventory > 10">In stock</span>
            <p>User is premium: {{ premium }}</p>
            <p>{{ sale }}</p>




            <p style="color: #1E95EA; font-size: 30px" v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>

            <p v-else
               class="underline"
            >Out of stock</p>

            <p>{{ description }}</p>


            <product-details :details="details"></product-details>

            <p>Shipping: {{ shipping }}</p>

            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            >
            </div>

            <div v-for="size in sizes">
                <p>{{ size }}</p>
            </div>

            

            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock  }"
            >
                {{cartAdd}}
            </button>

            <button @click="removeFromCart" style="background-color: red"
              >
            Remove from cart
            </button>



            <a :href="link">{{linkText}}</a>
        </div>



    </div>
    `,
    data(){
        return {
            product: "Socks",
        brand: 'Vue Mastery',
        description: 'A pair of warm, fuzzy socks',
        selectedVariant: 0,
        altText: 'A pair of socks',
        link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
        linkText: 'More products like this',
        inventory: 100,
        onSale: true,
        onSaleText: 'On Sale',
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0

            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,
        cartAdd: 'Add to cart',
        cartRemove: 'Remove to cart',
        }
    },
    methods: {

     
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
         },
         
        removeToCart() {
            if (this.cart !== 0){
                this.cart -= 1;
            }


        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeFromCart: function() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
       }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            }
            return  this.brand + ' ' + this.product + ' are not on sale'
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
         }
         
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeItem(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
              if (this.cart[i] === id) {
                 this.cart.splice(i, 1);
              }
            }
          }
     
    }
 })
 
 
 

