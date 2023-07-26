/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IChatFlow } from '../Interface'

@Entity()
export class ChatFlow implements IChatFlow {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    flowData: string

    @Column({ nullable: true })
    apikeyid: string

    @Column()
    deployed: boolean

    @Column()
    deleted: boolean

    @Column({ nullable: true })
    chatbotConfig?: string

    @Column()
    owner: string

    @Column()
    exported: boolean

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
