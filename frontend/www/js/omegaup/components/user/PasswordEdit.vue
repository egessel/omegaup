<template>
  <form @submit.prevent="onUpdatePassword">
    <div class="form-group">
      <label>{{ T.userEditChangePasswordOldPassword }}</label>
      <div>
        <input
          v-model="oldPassword"
          data-old-password
          type="password"
          size="30"
          required
          class="form-control"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ T.userEditChangePasswordNewPassword }}</label>
      <div>
        <input
          v-model="newPassword"
          data-new-password
          type="password"
          size="30"
          required
          class="form-control"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ T.userEditChangePasswordRepeatNewPassword }}</label>
      <div>
        <input
          v-model="newPassword2"
          data-new-password2
          type="password"
          size="30"
          required
          class="form-control"
          :class="invalidPasswordClass"
        />
        <div v-if="passwordMismatch" class="invalid-message">
          {{ T.passwordMismatch }}
        </div>
      </div>
    </div>
    <div>
      <button
        type="submit"
        class="btn btn-primary mr-2"
        :disabled="submitDisabled"
      >
        {{ T.wordsSaveChanges }}
      </button>
      <a href="/profile/" class="btn btn-cancel">{{ T.wordsCancel }}</a>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import T from '../../lang';

@Component
export default class UserPasswordEdit extends Vue {
  T = T;
  oldPassword = '';
  newPassword = '';
  newPassword2 = '';

  get passwordMismatch(): boolean {
    return this.newPassword != this.newPassword2;
  }

  get invalidPasswordClass(): string {
    return this.passwordMismatch ? 'invalid-input' : '';
  }

  get submitDisabled(): boolean {
    return (
      this.passwordMismatch ||
      this.newPassword.length === 0 ||
      this.newPassword2.length === 0 ||
      this.oldPassword.length === 0
    );
  }

  onUpdatePassword(): void {
    if (this.passwordMismatch) {
      return;
    }
    this.$emit('update-password', {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    });
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../sass/main.scss';
.invalid-input {
  border-color: var(--form-input-error-color);
}

.invalid-input:focus {
  box-shadow: 0 0 0 0.2rem var(--form-input-box-shadow-error-color);
}

.invalid-message {
  margin-top: 0.25rem;
  font-size: 80%;
  color: var(--form-input-error-color);
}
</style>
