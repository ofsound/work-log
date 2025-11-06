import { createRouter, createWebHistory } from 'vue-router'

import NewView from '@/views/NewView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import TagsView from '@/views/TagsView.vue'
import SessionsView from '@/views/SessionsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'new',
    component: NewView
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView
  },
  {
    path: '/tags',
    name: 'tags',
    component: TagsView
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: SessionsView
  }

  ],
})

export default router
