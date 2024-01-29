Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>

  `,
 data() {
    return {
        name: null,
        review: null,
        rating: null,
        recommend: null,
        errors: []
    }
 },
 methods:{
    onSubmit() {
        if(this.name && this.review && this.rating && this.recommend) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
        } else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.errors.push("Recommendation required.")
        }
     }
     

     
 
 }
 
 
 })

 

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

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>


            <product-review @review-submitted="addReview"></product-review>




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
        reviews: []
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
       },
       addReview(productReview) {
        this.reviews.push(productReview)
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
 
 
 

