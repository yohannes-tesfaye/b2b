import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
function resolveSchema(){try{return new URL(process.env.DATABASE_URL||"").searchParams.get("schema")||"public"}catch{return "public"}}
const adapter=new PrismaPg(process.env.DATABASE_URL||"",{schema:resolveSchema()});
const prisma=new PrismaClient({adapter});
(async()=>{
  const n=await prisma.listing.count();
  console.log("listing count:",n);
  const rows=await prisma.listing.findMany({take:5,select:{id:true,title:true,type:true,status:true,category:true,location:true,quantity:true}});
  console.log(JSON.stringify(rows,null,2));
  await prisma.$disconnect();
})();
