<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <q-stepper ref="stepper" v-model="step" header-nav color="primary" class="no-shadow" bordered animated>
          <q-step :name="1" title="Shipping address" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
            <div class="row">
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.first_name" dense outlined class="full-width" label="First Name *" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.last_name" dense outlined class="full-width" label="Last Name *" />
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <q-input
                    v-model="address_detail.address_line_1"
                    dense
                    autogrow
                    outlined
                    class="full-width"
                    label="Address line 1 *"
                  />
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <q-input
                    v-model="address_detail.address_line_2"
                    dense
                    autogrow
                    outlined
                    class="full-width"
                    label="Address line 2 *"
                  />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.city" dense outlined class="full-width" label="City *" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.state" dense outlined class="full-width" label="State" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.zip_code" dense outlined class="full-width" label="Zip Code" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.country" dense outlined class="full-width" label="Country *" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-checkbox
                    v-model="address_detail.checkbox"
                    dense
                    outlined
                    class="full-width"
                    label="Use this address for payment details"
                  />
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn
                rounded
                class="float-right q-mr-md q-mb-md"
                color="blue"
                label="Next"
                @click="
                  () => {
                    done1 = true
                    step = 2
                  }
                "
              />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Payment details" icon="shopping_cart" :done="step > 2" :header-nav="step > 2">
            <div class="row">
              <div class="col-6">
                <q-item>
                  <q-input v-model="card_detail.name" dense outlined class="full-width" label="Name on Card*" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input
                    v-model="address_detail.card_number"
                    dense
                    outlined
                    class="full-width"
                    label="Card Number *"
                  />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input
                    v-model="address_detail.expiry_date"
                    dense
                    autogrow
                    outlined
                    class="full-width"
                    label="Expiry Date *"
                  />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input v-model="address_detail.cvv" dense autogrow outlined class="full-width" label="CVV *" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-checkbox
                    v-model="address_detail.checkbox"
                    dense
                    outlined
                    class="full-width"
                    label="Remember credit card details for next time"
                  />
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn
                rounded
                class="float-right q-mr-md q-mb-md"
                color="blue"
                label="Next"
                @click="
                  () => {
                    done2 = true
                    step = 3
                  }
                "
              />
              <q-btn flat color="primary" rounded label="Back" class="q-mr-sm float-right" @click="step = 1" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Review your order" icon="shopping_cart" :header-nav="step > 3">
            <div class="row">
              <div class="col-12">
                <q-item-label header class="text-h6">Order summary</q-item-label>
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Product 1</q-item-label>
                    <q-item-label caption>Caption</q-item-label>
                  </q-item-section>
                  <q-item-section side> $10.99 </q-item-section>
                </q-item>
                <q-separator />
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Product 2</q-item-label>
                    <q-item-label caption>Caption Product 2</q-item-label>
                  </q-item-section>
                  <q-item-section side> $19.99 </q-item-section>
                </q-item>
                <q-separator />
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Product 3</q-item-label>
                    <q-item-label caption>Caption Product 3</q-item-label>
                  </q-item-section>
                  <q-item-section side> $78.99 </q-item-section>
                </q-item>
                <q-separator />
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Product 4</q-item-label>
                    <q-item-label caption>Caption Product 4</q-item-label>
                  </q-item-section>
                  <q-item-section side> $178.99 </q-item-section>
                </q-item>
                <q-separator />

                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Shipping</q-item-label>
                  </q-item-section>
                  <q-item-section side> Free </q-item-section>
                </q-item>
                <q-separator />
                <q-item class="full-width" style="border-top: 3px dotted blue">
                  <q-item-section>
                    <q-item-label lines="1">Total</q-item-label>
                  </q-item-section>
                  <q-item-section side> $288.96 </q-item-section>
                </q-item>
              </div>
            </div>

            <q-card class="rounded-borders">
              <q-card-section horizontal>
                <q-card-section class="col-5 q-pt-xs">
                  <div class="text-h6 text-center">Shipping</div>
                  <div class="text-subtitle1">Pratik Patel</div>
                  <div class="text-subtitle2">4841 Johnston Locks</div>
                </q-card-section>
                <q-card-section class="col-7 q-pt-xs">
                  <div class="text-h6 text-center">Payment details</div>
                  <div class="text-subtitle1 q-mb-xs">Card type - Visa</div>
                  <div class="text-subtitle1 q-mb-xs">Card holder - P***ik Patel</div>
                  <div class="text-subtitle1 q-mb-xs">Card Number - xxxx-xxxx-xxxx-1234</div>
                  <div class="text-subtitle1 q-mb-xs">Expiry date - 04/2012</div>
                </q-card-section>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn
                rounded
                class="float-right q-mr-md q-mb-md"
                color="blue"
                label="Place Order"
                @click="done3 = true"
              />
              <q-btn flat color="primary" rounded label="Back" class="q-mr-sm float-right" @click="step = 2" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card class="bg-grey-2 no-shadow" bordered>
          <q-card-section class="text-center text-h6 text-black">
            <q-icon name="shopping_cart" class="q-mr-sm" />
            Order Summary
          </q-card-section>
          <q-card-section horizontal>
            <q-card-section class="col-5 flex flex-center">
              <q-img height="80px" class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-sm">Product 1</div>
              <div class="text-subtitle2 q-mb-xs">$10.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img height="80px" class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 2</div>
              <div class="text-subtitle2 q-mb-xs">$19.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img height="80px" class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 3</div>
              <div class="text-subtitle2 q-mb-xs">$78.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img height="80px" class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 4</div>
              <div class="text-subtitle2 q-mb-xs">$178.99</div>
            </q-card-section>
          </q-card-section>

          <q-separator />
          <q-card-section class="row">
            <div class="col-12 text-h6 full-width">
              <div class="float-right q-mr-md">Total : <span class="text-blue">$288.96</span></div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from "vue"
  import { ref } from "vue"

  export default defineComponent({
    name: "CheckoutPage",
    setup() {
      return {
        step: ref(1),
        address_detail: ref({}),
        card_detail: ref({})
      }
    }
  })
</script>

<style scoped></style>
