import {FastifyPluginAsync} from "fastify";
import {CreateTaskInput} from "../domain/task/taskRepository.js";
import { Type } from '@sinclair/typebox';

export const CreateTaskSchema = Type.Object({
    title: Type.String(),
    description: Type.Optional(Type.String()),
    assignee : Type.Optional(Type.String()),
    tag : Type.Optional(Type.String()),
    boardId: Type.String(),
    dueDate: Type.Optional(
        Type.String({ format: "date-time" })
    ),
});

const taskRoute: FastifyPluginAsync = async (fastify) : Promise<void> => {
    fastify.post("/task",{
        schema : {
            tags :['task'],
            body :CreateTaskSchema
        }
    }, async (request ,reply) => {
        try {
            const body = request.body as CreateTaskInput

            const task = await fastify.services.task.createTask({
                ...body,
                ...(body.dueDate ? { dueDate: new Date(body.dueDate) } : {}),
            });

            return reply.send({
                ok: true,
                task: task
            });
        }catch (error){
            return reply.status(500).send({
                ok: false,
                error: (error as Error).message,
            });
        }
    })
}

export default taskRoute