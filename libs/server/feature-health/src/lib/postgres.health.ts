import { Injectable, Scope } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { drizzle } from "drizzle-orm/node-postgres"

@Injectable({scope: Scope.TRANSIENT})
export class PostgresHealthIndicator {
    db = drizzle(process.env['DATABASE_URL'])

    constructor(private healthIndicatorService: HealthIndicatorService) {}

    private async pingDb(
        const result = await this.db.execute('SELECT 1')
    )

    public async pingCheck<Key extends string = string>(key: Key) {
        const check = this.healthIndicatorService.check(key); 
    
    async isHealthy() {
        const health = this.healthIndicator.check("golfreports")

    }