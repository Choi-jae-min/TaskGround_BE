import fastify, {FastifyPluginAsync} from "fastify";
import {CreateMemberInput} from "../domain/workspace/members/memberRepository";
import {IMemberUpdateData, MemberRole, MemberStatus} from "../domain/workspace/members/memberService";

const memberRoute : FastifyPluginAsync = async (fastify) : Promise<void> => {
    // ---------------------------------------------------------
    // GET /member/:workSpaceId
    //    → 워크스페이스 맴버 조회
    // ---------------------------------------------------------
    fastify.get("/member/workspace/:workSpaceId" ,async  (request,reply) =>{
        const { workspaceId } = request.params as {workspaceId : string};

        return reply.send(workspaceId)
    })

    // ---------------------------------------------------------
    // GET /member/:id
    //    → 맴버 조회
    // ---------------------------------------------------------
    fastify.get("/member/:id" ,async  (request,reply) =>{
    })


    // ---------------------------------------------------------
    // POST /member/:workSpaceId
    //    → 워크스페이스 맴버 추가
    // ---------------------------------------------------------

    fastify.post("/member/:workspaceId" ,{
        schema : {
            tags : ['member'],
            body : {
                type: "object",
                properties: {
                    userId: { type: "string" },
                    role: { type: "string"},
                },
            }
        }
    },async  (request,reply) =>{
        const { workspaceId } = request.params as {workspaceId : string};
        const body = request.body as {userId : string, role : MemberRole}
        console.log('workspaceId' ,workspaceId)
        const memberData : CreateMemberInput = {
            workspaceId : workspaceId,
            userId : body.userId,
            role : body.role
        }
        return await fastify.services.member.addMemberToWorkspace(memberData)
    })

    fastify.put("/member/:id", {
        schema : {
            tags : ['member'],
            body : {
                type: "object",
                properties: {
                    status: { type: "string" },
                    role: { type: "string"},
                },
            }
        }
    },async  (request,reply) =>{
        const { id } = request.params as {id : string};
        const body = request.body as {status?: MemberStatus, role?: MemberRole}
        const memberData : IMemberUpdateData = {
            role: body.role,
            status: body.status
        }
        return await fastify.services.member.updateMember(id , memberData);
    })
}

export default memberRoute;