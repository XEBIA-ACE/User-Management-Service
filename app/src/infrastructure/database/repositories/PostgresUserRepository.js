'use strict';

const IUserRepository = require('../../../domain/ports/IUserRepository');
const User = require('../../../domain/entities/User');
const { getPool } = require('../connection');

/**
 * PostgreSQL adapter for IUserRepository.
 */
class PostgresUserRepository extends IUserRepository {
  /** @returns {import('pg').Pool} */
  get pool() {
    return getPool();
  }

  /**
   * Map a raw DB row to a User entity.
   * @param {Object} row
   * @returns {import('../../../domain/entities/User')}
   */
  _toEntity(row) {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      name: row.name,
      isVerified: row.is_verified,
      otpCode: row.otp_code,
      otpExpiresAt: row.otp_expires_at ? new Date(row.otp_expires_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  /** @override */
  async create(user) {
    const { rows } = await this.pool.query(
      `INSERT INTO users
         (id, email, password_hash, name, is_verified, otp_code, otp_expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user.id,
        user.email,
        user.passwordHash,
        user.name,
        user.isVerified,
        user.otpCode,
        user.otpExpiresAt,
        user.createdAt,
        user.updatedAt,
      ],
    );
    return this._toEntity(rows[0]);
  }

  /** @override */
  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows.length ? this._toEntity(rows[0]) : null;
  }

  /** @override */
  async findByEmail(email) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows.length ? this._toEntity(rows[0]) : null;
  }

  /** @override */
  async update(user) {
    const { rows } = await this.pool.query(
      `UPDATE users
       SET email          = $1,
           password_hash  = $2,
           name           = $3,
           is_verified    = $4,
           otp_code       = $5,
           otp_expires_at = $6,
           updated_at     = $7
       WHERE id = $8
       RETURNING *`,
      [
        user.email,
        user.passwordHash,
        user.name,
        user.isVerified,
        user.otpCode,
        user.otpExpiresAt,
        user.updatedAt,
        user.id,
      ],
    );
    if (!rows.length) {
      const err = new Error('User not found during update');
      err.statusCode = 404;
      throw err;
    }
    return this._toEntity(rows[0]);
  }

  /** @override */
  async delete(id) {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = PostgresUserRepository;
