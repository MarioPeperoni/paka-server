import type { Request, Response } from 'express';

import prisma from '../config/db';
import { uploadImageToAzure } from './image.controller';

export const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        courier: true,
        parcels: true,
        image: true,
      },
    });
    res.json(deliveries);
  } catch (err) {
    console.error('Error fetching deliveries:', err);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: Number(id) },
      include: {
        courier: true,
        parcels: true,
        image: true,
      },
    });

    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    console.error('Error fetching delivery:', err);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};

export const getDeliveriesByCourierId = async (req: Request, res: Response) => {
  const { courierId } = req.params;
  try {
    const deliveries = await prisma.delivery.findMany({
      where: { courierId: Number(courierId) },
      include: {
        courier: true,
        parcels: true,
        image: true,
      },
    });
    if (deliveries.length === 0)
      return res.status(404).json({ error: 'No deliveries found for this courier' });
    res.json(deliveries);
  } catch (err) {
    console.error('Error fetching deliveries for courier:', err);
    res.status(500).json({ error: 'Failed to fetch deliveries for courier' });
  }
};

export const createDelivery = async (req: Request, res: Response) => {
  const data = req.body;
  const coordinateX = 40.7128; // Example coordinate X
  const coordinateY = -74.006; // Example coordinate Y
  try {
    const delivery = await prisma.delivery.create({
      data: {
        ...data,
        coordinateX,
        coordinateY,
      },
    });
    res.status(201).json(delivery);
  } catch (err) {
    console.error('Error creating delivery:', err);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
};

export const updateDelivery = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const delivery = await prisma.delivery.update({
      where: { id: Number(id) },
      data,
    });
    res.json(delivery);
  } catch (err) {
    console.error('Error updating delivery:', err);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.delivery.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting delivery:', err);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    let delivery;

    if (status === 'left_parcel') {
      const imageUrl = await uploadImageToAzure(req);

      delivery = await prisma.delivery.update({
        where: { id: Number(id) },
        data: {
          status,
          image: {
            upsert: {
              create: { url: imageUrl },
              update: { url: imageUrl },
            },
          },
        },
        include: { image: true },
      });
    } else {
      delivery = await prisma.delivery.update({
        where: { id: Number(id) },
        data: { status },
      });
    }

    res.json(delivery);
  } catch (err) {
    console.error('Error updating delivery status:', err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};
