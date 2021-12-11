import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)

// Global directive to observe element visibility
// <div v-observe="0.1" @visible, @hidden>
app.directive('intersect', {
  mounted: function (el, binding, vnode) {
    const threshold = binding.value || 0.5 // v-observe="0.1"
    const onIntersection = entries => {
      const eventName = entries[0].isIntersecting ? 'intersect' : 'outersect'
      // emit...
      if (vnode.componentInstance) {
        // component ?
        vnode.componentInstance.$emit(eventName) // , {detail: eventDetail}); // use {detail:} to be uniform
      } else {
        // vanilla DOM element
        vnode.el.dispatchEvent(new CustomEvent(eventName)) // , {detail: eventDetail}));
      }
      // unobserve!
      // el.observer.unobserve(el)
    }
    // observe!
    el.observer = new IntersectionObserver(onIntersection, { threshold })
    el.observer.observe(el)
  }
  // unbind: function (el) {
  //   el.observer.unobserve(el)
  // }
})

app
  .use(router)
  .use(store)
  .mount('#app')
