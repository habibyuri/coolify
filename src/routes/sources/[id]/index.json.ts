import { getTeam, getUserDetails } from '$lib/common';
import * as db from '$lib/database';
import { PrismaErrorHandler } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (request) => {
	const { teamId, status, body } = await getUserDetails(request);
	if (status === 401) return { status, body };

	const { id } = request.params;
	try {
		const source = await db.getSource({ id, teamId });
		const settings = await db.listSettings();
		return {
			status: 200,
			body: {
				source,
				settings
			}
		};
	} catch (error) {
		return PrismaErrorHandler(error);
	}
};

export const del: RequestHandler = async (request) => {
	const { status, body } = await getUserDetails(request);
	if (status === 401) return { status, body };

	const { id } = request.params;

	try {
		await db.removeSource({ id });
		return { status: 200 };
	} catch (error) {
		return PrismaErrorHandler(error);
	}
};

export const post: RequestHandler = async (event) => {
	const { teamId, status, body } = await getUserDetails(event);
	if (status === 401) return { status, body };

	const { id } = event.params;

	const { name } = await event.request.json();

	try {
		await db.updateGitsource({ id, name });
		return { status: 201 };
	} catch (error) {
		return PrismaErrorHandler(error);
	}
};
