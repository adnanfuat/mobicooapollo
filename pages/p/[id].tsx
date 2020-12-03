import Layout from '../../components/Layout'
import Router, { useRouter } from 'next/router'
import { withApollo } from '../../apollo/client'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

const PostQuery = gql`
  query PostQuery($postId: String!) {
    
     gorevlendirme (gorevlendirmeId:$postId) {numara baslik aciklama gorevlipersonel {kullanici eposta }} 
    
  }
`



const PublishMutation = gql`
  mutation PublishMutation($postId: String!) {

    
  publish(gorevlendirmeId: $postId) {
    gorev_numara
    baslik
    aciklama
    gorevlipersonel {
      kullanici
      eposta
    }
  }


  }
`



const DeleteMutation = gql`
  mutation DeleteMutation($postId: String!) {
    
    
  deletePost(gorevlendirmeId: $postId) {
    numara
    gorev_numara
    surec_numara
    baslik
    aciklama
    gorevlipersonel {
      kullanici
      eposta
    }
  }

  }
`

function Post() {
  const postId = useRouter().query.id
  const { loading, error, data } = useQuery(PostQuery, {
    variables: { postId },
  })

  const [publish] = useMutation(PublishMutation)
  const [deletePost] = useMutation(DeleteMutation)

  if (loading) {
    console.log('loading')
    return <div>Loading ...</div>
  }
  if (error) {
    console.log('error' )
    return <div>Error: {error.message}</div>
  }

  console.log(`response`, data)

  let title = data.gorevlendirme.baslik
  if (!data.gorevlendirme.aktif) {
    title = `${title} (Draft)`
  }

  const authorName = data.gorevlendirme.gorevlipersonel ? data.gorevlendirme.gorevlipersonel.kullanici : 'Unknown author'
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {authorName}</p>
        <p>{data.gorevlendirme.content}</p>
        {!data.gorevlendirme.aktif && (
          <button
            onClick={async e => {
              await publish({
                variables: {
                  postId,
                },
              })
              Router.push('/')
            }}>
            Publish
          </button>
        )}
        <button
          onClick={async e => {
            await deletePost({
              variables: {
                postId,
              },
            })
            Router.push('/')
          }}>
          Delete
        </button>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default withApollo(Post)
