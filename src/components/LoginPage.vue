<template>
  <div class="dialog-container">
    <div style="flex: 1"></div>
    <div open class="login-dialog" style="flex: 3">
      <div class="header">
        <h1>输入信息</h1>
      </div>
      <div>
        <div class="input">
          <label for="name">API token</label>
          <input v-model="auth" autocomplete="off" type="text" required />
        </div>
        <div class="input">
          <label for="email">Username</label>
          <input v-model="user" autocomplete="off" type="text" required />
        </div>
      </div>
      <div class="btn-container">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button @click="validate">保存</button>
      </div>
    </div>
    <div style="flex: 2"></div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import HypoServiceMixin from "./HypoServiceMixin";
import Router from "./Router";
@Component
export default class LoginPage extends mixins(Vue, HypoServiceMixin) {
  user = "";
  auth = "";
  redirectTo = "";
  @InjectReactive() router!: Router;
  validate() {
    if (!/acct:[^A-Z0-9._]{3,30}@.*$/.test(this.user) && this.user) {
      this.user = `acct:${this.user}@hypothes.is`;
    }

    // no token
    if (!this.auth) {
      window.localStorage.setItem("authKey", "");
      window.localStorage.setItem("user", this.user);
      this.cancel();
    }

    // token must with user
    this.getProfile(this.auth).then((profile) => {
      if (profile.userid == this.user) {
        window.localStorage.setItem("authKey", this.auth);
        window.localStorage.setItem("user", this.user);
        this.router.goto("/", true);
      }
    });
  }
  cancel() {
    this.router.goto("/");
  }
  created() {
    const match = window.location.search.match(/redirectTo=(.+)$/);
    if (match) {
      this.redirectTo = decodeURIComponent(match[1]);
    }
    const currentToken = localStorage.getItem("authKey");
    const currentUser = localStorage.getItem("user");
    this.auth = currentToken ? currentToken : "";
    this.user = currentUser ? currentUser : "";
  }
}
</script>

<style  lang="scss">
@use "scss/theme";
$background: map-get(theme.$palette, "background");
$on-background: map-get(theme.$palette, "on-background");
.dialog-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: hidden;
  background-color: var(--background-color-primary);
  color: var(--foreground-color-secondary);
  .login-dialog {
    width: 30%;
    @media screen and (max-width: 900px) {
      width: 60%;
    }
    @media screen and (max-width: 400px) {
      width: 90%;
    }
    padding: 1em;
    // border: solid 2px black;
    .header {
      width: 100%;
      h1 {
        padding: 0.1em 0.3em;
        font-size: 2ch;
        margin: 0px;
        text-align: start;
      }
    }
    .input {
      position: relative;
      label {
        position: relative;
        top: 1.5em;
        float: left;
        left: 0.5em;
        user-select: none;
        color: hsl(0, 0%, 80%);
      }
      input {
        box-sizing: border-box;
        font-weight: normal;
        font-size: 19px;
        padding: 1.5em 1em 0.5em 0.5em;
        border: 1px solid var(--background-color-primary-5);
        border-radius: 2px;
        color: var(--foreground-color-secondary);
        background-color: var(--background-color-primary-9);
        line-height: 1;
        width: 100%;
        transition: 0.1s;
        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px #59a7e8;
        }
      }
    }
    .btn-container {
      margin: 1em 0;
      display: flex;
      justify-content: flex-end;
      button {
        background-color: hsl(0, 0%, 40%);
        cursor: pointer;
        color: white;
        border: none;
        padding: 1em 2em;
        transition: color 0.2s, background-color 0.2s;
        &:hover {
          background-color: hsl(0, 90%, 70%);
        }
      }
      .btn-cancel {
        margin-right: 1em;
        background-color: var(--background-color-primary-3);
        &:hover {
          background-color: var(--background-color-primary-1);
        }
      }
    }
  }
}
</style>