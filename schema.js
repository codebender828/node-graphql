const fetch = require('node-fetch');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Fixtures for fake static data
// const customers = [
//     { id:'1', name:'Jonathan Bakebwa', email: 'jbakebwa@gmail.com', age: 22 },
//     { id:'2', name:'Thomas Bananas', email: 'tbone@mgmail.com', age: 43 },
//     { id:'3', name:'Sarah Pickles', email: 'sarah@main.com', age: 19 }
// ]

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields:() => ({
        id: { type : GraphQLString },
        name: { type : GraphQLString },
        email: { type : GraphQLString },
        title: { type: GraphQLString }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type : GraphQLString }
            },
            resolve(parentValue, args) {

                // ? For fake static data
                // for( let i = 0; i < customers.length; i++ ) {
                //     if(customers[i].id === args.id) {
                //         return customers[i];
                //     }
                // }

                return fetch(`http://localhost:3000/customers/${args.id}`).then((res) => res.json());
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return fetch('http://localhost:3000/customers').then((res) => res.json())
            }
        }
    }
})

// Mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        // Add Customers
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return fetch('http://localhost:3000/customers', {
                    method: 'post',
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({
                        name : args.name,
                        email : args.email,
                        title : args.title ,
                    }),
                })
                .then((res) => res.json());
            }
        },

        // Delete Customers
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return fetch(`http://localhost:3000/customers/${args.id}`, {
                    method: 'delete'
                })
                .then((res) => res.json());
            }
        },

        // Edit Customers
        editCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                title: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return fetch(`http://localhost:3000/customers/${args.id}`, {
                    method: 'patch',
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({
                        name : args.name,
                        email : args.email,
                        title : args.title ,
                    }),
                })
                .then((res) => res.json());
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})