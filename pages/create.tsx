import React, { useState } from "react"
import Layout from "../components/Layout"
import Router from "next/router"
import { withApollo } from "../apollo/client"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

const CreateDraftMutation = gql`
  mutation CreateDraftMutation(
    $baslik: String!
    $aciklama: String
    $eposta: String!
  ) {
    createDraft(baslik: $baslik, aciklama: $aciklama, eposta: $eposta) {
      
      numara
      gorev_numara
      surec_numara
      termin_dk
      termin_saat
      termin_gun
      baslik
      eklenme_tarihi
      bitirilmesi_gereken_tarih
      saat
      bitirilmesi_gereken_saat
      muhlet_bitis_tarihi

    }
  }




`



function Draft(props) {
  const [baslik, setTitle] = useState("")
  const [aciklama, setContent] = useState("")
  const [eposta, setAuthorEmail] = useState("")

  const [createDraft, { loading, error, data }] = useMutation(
    CreateDraftMutation
  )

  return (
    <Layout>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            await createDraft({
              variables: {
                baslik,
                aciklama,
                eposta,
              },
            })
            Router.push("/drafts")
          }}
        >
          <h1>Create Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={baslik}
          />
          <input
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Author (email adress)"
            type="text"
            value={eposta}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={aciklama}
          />
          <input
            disabled={!aciklama || !baslik || !eposta}
            type="submit"
            value="Create"
          />
          <a className="back" href="#" onClick={() => Router.push("/")}>
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
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
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

export default withApollo(Draft)
