<template>
    <div >
      <v-container class="pt-10 padding-bottom">
        <h1 class="text-center">{{ sendText }}</h1>
        <v-row no-gutters class="pt-5">
            <v-col class="col-12 col-md-4 col-sm-12">
                <v-row >
                    <v-col class="col-12 col-sm-3 pr-4" align="right">
                    <v-icon class="display-1">mdi-map-marker</v-icon>
                    </v-col>
                    <v-col class="col-12 col-sm-9 pr-4 my-auto">
                    <h3 class="font-weight-light">Belgrade, Serbia</h3>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="col-12 col-md-4 col-sm-12">
                <v-row >
                    <v-col class="col-12 col-sm-3 pr-4" align="right">
                    <v-icon class="display-1">mdi-email-outline</v-icon>
                    </v-col>
                    <v-col  class="col-12 col-sm-9 pr-4 my-auto">
                    <h3 class="font-weight-light">info@boilerplate.com</h3>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="col-12 col-md-4 col-sm-12">
                <v-row>
                    <v-col class="col-12 col-sm-3 pr-4" align="right">
                    <v-icon class="display-1">mdi-phone</v-icon>
                    </v-col>
                    <v-col  class="col-12 col-sm-9 pr-4 my-auto">
                    <h3 class="font-weight-light">+381 645310325</h3>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
      </v-container>

      <v-container>
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <h1 class="text-center">{{ sendEmailText }}</h1>
                    <div class="my-2" v-show="resultResponse.length > 0"> {{ resultResponse }}</div>
                    <validation-observer
                    ref="observer"
                    v-slot="{ invalid }"
                    >
                        <form @submit.prevent="submit">

                            <validation-provider
                        v-slot="{ errors }"
                        name="Name"
                        rules="required|min:3|alpha_spaces"
                        >
                          <v-text-field
                              v-model="name"
                              :error-messages="errors"
                              label="Name"
                              required
                          ></v-text-field>
                            </validation-provider>
                            
                            <validation-provider
                                v-slot="{ errors }"
                                name="email"
                                rules="required|email"
                            >
                                <v-text-field
                                v-model="email"
                                :error-messages="errors"
                                label="E-mail"
                                required
                                ></v-text-field>
                            </validation-provider>

                            <validation-provider
                            v-slot="{ errors }"
                            name="Subject"
                            rules="required|min:3|alpha_spaces"
                            >
                                <v-text-field
                                    v-model="subject"
                                    :error-messages="errors"
                                    label="Subject"
                                    required
                                ></v-text-field>
                            </validation-provider>

                            <validation-provider
                            v-slot="{ errors }"
                            name="Message"
                            rules="required|min:10|alpha_spaces"
                            >
                                <v-textarea
                                    v-model="message"
                                    :error-messages="errors"
                                    label="Message"
                                    required
                                    clearable
                                    rows="3"
                                ></v-textarea>
                            </validation-provider>
                            
                            <v-btn
                            class="mr-4"
                            type="submit"
                            :disabled="invalid"
                            >
                            {{ sendText }}
                            </v-btn>

                        </form>
                    </validation-observer>
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>
import translate from '../util/genTable/multilanguageHelper.js'
import { isAuthorized, getActorData} from '../util/user'

export default {
    data: () => ({
        name: '',
        email: '',
        subject: '',
        message: '',
        sendText: translate('Contact us', 'nav'),
        sendEmailText: translate('Send us an email', 'contact'),
        resultResponse: '',
    }),
    methods: {
        submit() {
            this.$refs.observer.validate();

            this.$http.post("email", {
                name: this.name,
                email: this.email,
                userSubject: this.subject,
                message: this.message
            })
            .then(response => {
                this.resultResponse = translate('Email sent successfully', 'contact');
            })
            .catch(err => {
                this.resultResponse = translate('An error has occurred', 'contact')                
            })
        }
    },
    beforeCreate: function() {
        if(isAuthorized()) {
            let userId = getActorData().UserId

            this.$http.get("users/" + userId)
                .then(response => {
                this.name = response.data.name,
                this.email = response.data.email
                })
                .catch(err => console.log(err))
        }
    }
}
</script>