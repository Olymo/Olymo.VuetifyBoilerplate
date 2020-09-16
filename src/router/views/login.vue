<script>
import Layout from '@layouts/main.vue'
import appConfig from '@src/app.config'
import { authMethods } from '@state/helpers'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      password: '',
      authError: null,
      tryingToLogIn: false,
    }
  },
  computed: {
    placeholders() {
      return process.env.NODE_ENV === 'production'
        ? {}
        : {
            username: 'Use "admin" to log in with the dev API',
            password: 'Use "password" to log in with the dev API',
          }
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if if existed.
      this.authError = null
      return this.logIn({
        username: this.username,
        password: this.password,
      })
        .then(() => {
          this.tryingToLogIn = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch((error) => {
          this.tryingToLogIn = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
  <Layout>
    <form :class="$style.form" @submit.prevent="tryToLogIn">
      <BaseInputText
        type="text"
        v-model="username"
        name="username"
        :placeholder="placeholders.username"
      />

      <BaseInputText
        type="password"
        v-model="password"
        name="password"
        :placeholder="placeholders.password"
      />

      <BaseButton :disabled="tryingToLogIn" type="submit">
        <BaseIcon v-if="tryingToLogIn" name="sync" spin />
        <span v-else>
          Log in
        </span>
      </BaseButton>

      <p v-if="authError">
        There was an error logging in to your account.
      </p>
    </form>
  </Layout>
</template>

<style lang="scss" module>
.form {
  text-align: center;
}
</style>
