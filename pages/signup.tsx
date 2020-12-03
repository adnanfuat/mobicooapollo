import React, { useState } from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import { withApollo } from '../apollo/client'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const SignupMutation = gql`
mutation SignupMutation(
  $kullanici: String
  $eposta: String

) {
  signupUser(
    kullanici: $kullanici
    eposta: $eposta
    kisa_ad: "assdasda"
    yetkiler: "asdsasda"
  ) {
    numara
    kullanici
    eposta
    kisa_ad
    yetkiler
  }
}

`

function Signup(props) {
  const [baslik, setName] = useState('')
  const [eposta, setEmail] = useState('')

  const [signup] = useMutation(SignupMutation)

  return (
    <Layout>
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault()
            console.log('submit', baslik, eposta)

            await signup({
              variables: {
                baslik: baslik,
                eposta: eposta,
              },
            })
            Router.push('/')
          }}>
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => setName(e.target.value)}
            placeholder="baslik"
            type="text"
            value={baslik}
          />
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address)"
            type="text"
            value={eposta}
          />
          <input disabled={!baslik || !eposta} type="submit" value="Signup" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
        }

        input[type='text'] {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default withApollo(Signup)
