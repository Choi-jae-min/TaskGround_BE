import {FastifyPluginAsync} from "fastify";
import {CreateTaskInput, UpdateTaskInput} from "../domain/task/taskRepository.js";
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
                version : 1
            });

            return reply.send({
                ok: true,
                task: task,
                version : task.version
            });
        }catch (error){
            return reply.status(500).send({
                ok: false,
                error: (error as Error).message,
            });
        }
    })

    fastify.put("/task/:id",{
        schema : {
            tags :['task'],
        }
    }, async (request ,reply) => {
        try {
            const { id } = request.params as { id: string };
            const body = request.body as UpdateTaskInput
            console.log('body' , body)
            const result = await fastify.services.task.updateTask(id, body);
            if (result?.ok === false) {
                if (result.code === "NOT_FOUND") {
                    return reply.code(404).send({ ok: false, error: "NOT_FOUND" });
                }
                if (result.code === "CONFLICT") {
                    return reply.code(409).send({
                        ok: false,
                        error: "CONFLICT",
                        current: result.current, // 최신 version 정보
                    });
                }
                if (result.code === "VERSION_REQUIRED") {
                    return reply.code(400).send({ ok: false, error: "VERSION_REQUIRED" });
                }
            }

            return reply.send({ ok: true, task: result.task });
        }catch (error){
            return reply.status(500).send({
                ok: false,
                error: (error as Error).message,
            });
        }
    })
}

export default taskRoute