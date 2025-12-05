import {FastifyPluginAsync} from "fastify";
import {CreateMemberInput} from "../domain/workspace/members/memberRepository";
import {IMemberUpdateData, MemberRole, MemberStatus} from "../domain/workspace/members/memberService";

const memberRoute : FastifyPluginAsync = async (fastify) : Promise<void> => {
    fastify.get("/member/workspace/:workspaceId" ,async  (request) =>{
        const { workspaceId } = request.params as {workspaceId : string};
        return await fastify.services.member.getMemberByWorkSpaceId(workspaceId)
    })

    fastify.get("/member/:id" ,async  () =>{
    })



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
    },async  (request) =>{
        const { workspaceId } = request.params as {workspaceId : string};
        const body = request.body as {userId : string, role : MemberRole}
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
    },async  (request) =>{
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