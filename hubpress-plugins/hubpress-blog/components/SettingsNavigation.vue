<template>
<div>
    <div class="fields" v-for="(nav, index) in navigation" :key="nav.label">
        <div class="four wide field">
            <input type="text" placeholder="Label" :name="`navigation-label-${index}`" :value="nav.label">
        </div>
        <div class="eleven wide field">
            <input type="text" placeholder="http://www.mysite.com" :name="`navigation-url-${index}`" :value="nav.url">
        </div>
        <div class="one wide field">
            <button class="ui icon button" v-on:click.stop.prevent="remove(index)">
                <i class="trash icon"></i>
            </button>
        </div>
    </div>
    <div class="fields">
        <div class="four wide field">
            <input type="text" placeholder="Label" v-model="newNav.label">
        </div>
        <div class="eleven wide field">
            <input type="text" placeholder="http://www.mysite.com" v-model="newNav.url">
        </div>
        <div class="one wide field">
            <button class="ui icon button" v-on:click.stop.prevent="add(newNav)" :disabled="isNotValid">
                <i class="add icon"></i>
            </button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'navigation-settings',
    data() {
        return {
            newNav: {
                label: '',
                url: ''
            },
            navigation: this.$store.state.application.config.navigation || []
        }
    },
    computed: { 
        isNotValid() {
            return this.newNav.label.trim()==='' || this.newNav.url.trim()===''
        }
    },
    methods: {
        remove(index) {
            this.navigation.splice(index, 1)
        },
        clear() {
            this.newNav = {
                label: '',
                url: ''
            }
        },
        add(nav) {
            this.navigation.push(nav)
            this.clear()
        }
    }
}
</script>

<style scoped>
    .navigation-container > .menu {
        height: 47px;
    }
</style>
