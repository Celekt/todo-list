import {createWebHistory, createRouter} from "vue-router";
import TodoList from "./TodoList.vue";

const routes = [
    {
        path: "/",
        component: TodoList,
        name: "home",
        beforeEnter: () => {
            let todos = JSON.parse(localStorage.getItem("myLists"))
            if (!todos || Object.keys(todos).length === 0) {
                todos = {0: []};
                localStorage.setItem('myLists', JSON.stringify(todos))
            }
            const id = Object.keys(todos)[0];
            return `/todo/${id}`;

        }
    },
    {
        path: "/todo/:id",
        component: TodoList,
        name: "todo",
        beforeEnter: (to) => {
            let todos = JSON.parse(localStorage.getItem("myLists"))
            if (!todos || !todos[to.params.id]) {
                return `/`;
            }
        }
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});