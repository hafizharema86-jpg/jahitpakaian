"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  return await prisma.siteSettings.findUnique({ where: { id: 1 } });
}

export async function updateSiteSettings(data: any) {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function getServices() {
  return await prisma.service.findMany({ orderBy: { order: 'asc' } });
}

export async function saveService(data: any) {
  if (data.id) {
    await prisma.service.update({ where: { id: data.id }, data });
  } else {
    await prisma.service.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteService(id: number) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function getPortfolios() {
  return await prisma.portfolio.findMany({ orderBy: { order: 'asc' } });
}

export async function savePortfolio(data: any) {
  if (data.id) {
    await prisma.portfolio.update({ where: { id: data.id }, data });
  } else {
    await prisma.portfolio.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/portfolios");
}

export async function deletePortfolio(id: number) {
  await prisma.portfolio.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/portfolios");
}

export async function getTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
}

export async function saveTestimonial(data: any) {
  if (data.id) {
    await prisma.testimonial.update({ where: { id: data.id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function getFaqs() {
  return await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
}

export async function saveFaq(data: any) {
  if (data.id) {
    await prisma.fAQ.update({ where: { id: data.id }, data });
  } else {
    await prisma.fAQ.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}

export async function deleteFaq(id: number) {
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}
