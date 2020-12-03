import { makeSchema, objectType, stringArg, asNexusMethod, intArg } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import path from 'path'

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

const prisma = new PrismaClient()

const Yonetim = objectType({
  name: 'Yonetim',
  definition(t) {
    t.int('numara')
    t.string('kullanici')
    t.string('eposta')
    t.string('kisa_ad')  
    t.string('yetkiler')  
    t.list.field('gorevleri', {
      type: 'Gorevlendirmeler',
      resolve: parent => prisma.yonetim.findUnique({where:{numara:Number(parent.numara)}}).gorevleri() })


//----------------->


// prisma.yonetim
// .findUnique({
//   where: { numara: Number(parent.numara) },
// })
// .gorevleri(),
// })

//----------------------->


  },
})

const Gorevlendirmeler = objectType({
  name: 'Gorevlendirmeler',
  definition(t) {
    t.int('numara')
    t.int('gorev_numara')  
    t.int('surec_numara')
    t.int('termin_dk')          
    t.int('termin_saat')   
    t.int('termin_gun')  
    t.string('baslik')
    t.string('aciklama') // { nullable: true, }    
    t.string('aktif')
    t.int('personel_numara')
    t.date('eklenme_tarihi')    
    t.date('bitirilmesi_gereken_tarih')    
    t.date('muhlet_bitis_tarihi') 
    t.string('ana_gorev_saat') 
    t.string('eklenme_saati') 
    t.string('bitirilmesi_gereken_saat') 
    t.string('muhlet_bitis_saati') 
    t.string("saat")
    t.field('gorevlipersonel', {
      type: 'Yonetim', 
      //      nullable: true,
      resolve: parent =>
        prisma.gorevlendirmeler
          .findUnique({
            where: { numara: Number(parent.numara) },
          })
          .gorevlipersonel(),


    })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('gorevlendirme', {
      type: 'Gorevlendirmeler',
      args: {
        gorevlendirmeId: stringArg(),  //  postId: stringArg({ nullable: false }),
      },
      resolve: (_, args) => {
        return prisma.gorevlendirmeler.findUnique({
          where: { numara  : Number(args.gorevlendirmeId) },  //    where: { id: Number(args.kullaniciId) },
        })
      },
    })

    t.list.field('feed', {
      type: 'Gorevlendirmeler',
      resolve: (_parent, _args, ctx) => {
        return prisma.gorevlendirmeler.findMany({
          where: { aktif: "1" },
        })
      },
    })

    t.list.field('drafts', {
      type: 'Gorevlendirmeler',
      resolve: (_parent, _args, ctx) => {
        return prisma.gorevlendirmeler.findMany({
          where: { aktif: "0"  },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Gorevlendirmeler',
      args: {
        searchString: stringArg(), // stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return prisma.gorevlendirmeler.findMany({
          where: {
            OR: [
              { baslik: { contains: searchString } },
              { aciklama: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signupUser', {
      type: 'Yonetim',
      args: {
        numara:intArg(),
        kullanici: stringArg(),
        eposta: stringArg(), //         email: stringArg({ nullable: false }),
        kisa_ad: stringArg(),
        yetkiler: stringArg()
      },
      resolve: (_, { kullanici, eposta, kisa_ad, yetkiler }, ctx) => {
        return prisma.yonetim.create({
          data: {
            kullanici,
            eposta,
            kisa_ad,
            yetkiler
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Gorevlendirmeler', //       nullable: true,

      args: {
        gorevlendirmeId: stringArg(),
      },
      resolve: (_, { gorevlendirmeId }, ctx) => {
        return prisma.gorevlendirmeler.delete({
          where: { numara: Number(gorevlendirmeId) },
        })
      },
    })

    t.field('createDraft', {
      type: 'Gorevlendirmeler',
      args: {
        baslik: stringArg(), //         title: stringArg({ nullable: false }),
        aciklama: stringArg(),
        eposta: stringArg(),
      },
      resolve: (_, { baslik, aciklama, eposta }, ctx) => {
        return prisma.gorevlendirmeler.create({
          data: {
            baslik,
            aciklama,
            aktif: "0",
            ana_gorev:"a",
            ana_gorev_numara:1,
            bitirilmesi_gereken_saat:"12:18:14",
            bitirilmesi_gereken_tarih:"2017-01-27T15:19:53.000Z",
            eklenme_saati:"12:18:14",
            muhlet_bitis_saati:"12:18:14",
            eklenme_tarihi:"2017-01-27T15:19:53.000Z",
            muhlet_bitis_tarihi:"2017-01-27T15:19:53.000Z",
            gorev_numara:1,
            saat:"15:12:53",
            surec_numara:1,
            tarih:"2017-01-27T15:19:53.000Z",
            termin_dk:245,
            termin_gun:1,
            termin_saat:6,
            gorevlipersonel: {
              connect: { eposta: eposta },
            },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Gorevlendirmeler',
      // nullable: true,
      args: {
        gorevlendirmeId: stringArg(),
      },
      resolve: (_, { gorevlendirmeId }, ctx) => {
        return prisma.gorevlendirmeler.update({
          where: { numara: Number(gorevlendirmeId) },
          data: { aktif: "1" },
        })
      },
    })
  },
})




export const schema = makeSchema({
  types: [Query, Mutation, Gorevlendirmeler, Yonetim, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql'),
  
    
  },

})


export const config = {
  api: {
    bodyParser: false,
     }
};

export default new ApolloServer({   schema  } ).createHandler({
  path: '/api', 
  

});