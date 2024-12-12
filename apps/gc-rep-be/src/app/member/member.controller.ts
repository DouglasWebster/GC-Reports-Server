import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMemberRequest } from './dto/create-member.request';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async getMembers() {
    return this.memberService.getMembers();
  }
  @Get(':firstName, :lastName')
  async getMemberByName(member: CreateMemberRequest) {
    return this.memberService.getMemberByName(member);
  }

  @Post()
  async createMember(@Body() request: CreateMemberRequest) {
    return this.memberService.createMember(request)
  }
}
