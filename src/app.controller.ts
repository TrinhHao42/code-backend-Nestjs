import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {};
  }

  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @Get('register')
  @Render('register')
  registerPage() {
    return {};
  }

  @Get('profile')
  @Render('profile')
  profilePage() {
    return {};
  }

  @Get('admin/gifts-management')
  @Render('admin-dashboard')
  adminDashboard() {
    return {};
  }

  @Get('gifts/:id')
  @Render('gift-detail')
  giftDetailPage() {
    return {};
  }
}
