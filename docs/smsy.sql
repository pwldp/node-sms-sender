--
-- PostgreSQL database dump
--

-- Dumped from database version 9.2.4
-- Dumped by pg_dump version 9.2.4
-- Started on 2013-06-11 15:25:39 CEST

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 172 (class 3079 OID 11766)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1995 (class 0 OID 0)
-- Dependencies: 172
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 186 (class 1255 OID 39731700)
-- Name: move_sent_sms_from_queue_to_arch(); Type: FUNCTION; Schema: public; Owner: smssender
--

CREATE FUNCTION move_sent_sms_from_queue_to_arch() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
  IF NEW.status = 'sent' THEN
	INSERT INTO sms_archive (sms_id,ts_add_to_queue,ts_sent,status,sender_id,sender_name,receiver_id,receiver_name,receiver_phone_number,sms_contents,note) 
	VALUES (OLD.id,OLD.ts_add_to_queue,OLD.ts_sent,NEW.status,OLD.sender_id,OLD.sender_name,OLD.receiver_id,OLD.receiver_name,OLD.receiver_phone_number,OLD.sms_contents,OLD.note);
	DELETE FROM sms_send_queue WHERE id=OLD.id;
  END IF;
  RETURN new;
END;
$$;


ALTER FUNCTION public.move_sent_sms_from_queue_to_arch() OWNER TO smssender;

--
-- TOC entry 185 (class 1255 OID 39730445)
-- Name: new_sms_in_queue_notify(); Type: FUNCTION; Schema: public; Owner: smssender
--

CREATE FUNCTION new_sms_in_queue_notify() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
json TEXT;
BEGIN
  IF NEW.status = 'new' THEN
	json := '{' || 
	'"id":' || NEW.id || 
	',"ts_add_to_queue":"' || NEW.ts_add_to_queue || '"' || 
	',"status":"' || NEW.status || '"'
	',"sender_id":' || NEW.sender_id ||
	',"sender_name":"' || NEW.sender_name || '"' || 
	',"receiver_id":' || NEW.receiver_id ||
	',"receiver_name":"' || NEW.receiver_name || '"' || 
	',"receiver_phone_number":"' || NEW.receiver_phone_number || '"' || 
	',"sms_contents":"' || NEW.sms_contents || '"' ||
	',"note":"' || NEW.note || '"'
	|| '}';
	PERFORM pg_notify('new_sms_in_queue', json);
  END IF;
  RETURN new;
END;
$$;


ALTER FUNCTION public.new_sms_in_queue_notify() OWNER TO smssender;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 171 (class 1259 OID 39730258)
-- Name: sms_archive; Type: TABLE; Schema: public; Owner: smssender; Tablespace: 
--

CREATE TABLE sms_archive (
    counter integer NOT NULL,
    sms_id bigint DEFAULT 0 NOT NULL,
    ts_add_to_queue timestamp without time zone NOT NULL,
    ts_sent timestamp without time zone NOT NULL,
    status character varying DEFAULT 'new'::character varying NOT NULL,
    sender_id bigint DEFAULT 0 NOT NULL,
    sender_name character varying DEFAULT ''::character varying NOT NULL,
    receiver_id bigint DEFAULT 0 NOT NULL,
    receiver_name character varying DEFAULT ''::character varying NOT NULL,
    receiver_phone_number character varying NOT NULL,
    sms_contents character varying NOT NULL,
    note text
);


ALTER TABLE public.sms_archive OWNER TO smssender;

--
-- TOC entry 169 (class 1259 OID 39730072)
-- Name: sms_send_queue; Type: TABLE; Schema: public; Owner: smssender; Tablespace: 
--

CREATE TABLE sms_send_queue (
    id integer NOT NULL,
    ts_add_to_queue timestamp without time zone DEFAULT now() NOT NULL,
    ts_sent timestamp without time zone DEFAULT now() NOT NULL,
    status character varying DEFAULT 'new'::character varying NOT NULL,
    sender_id bigint DEFAULT 0 NOT NULL,
    sender_name character varying DEFAULT ''::character varying NOT NULL,
    receiver_id bigint DEFAULT 0 NOT NULL,
    receiver_name character varying DEFAULT ''::character varying NOT NULL,
    receiver_phone_number character varying NOT NULL,
    sms_contents character varying NOT NULL,
    note text
);


ALTER TABLE public.sms_send_queue OWNER TO smssender;

--
-- TOC entry 168 (class 1259 OID 39730070)
-- Name: sms_send_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: smssender
--

CREATE SEQUENCE sms_send_queue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sms_send_queue_id_seq OWNER TO smssender;

--
-- TOC entry 1996 (class 0 OID 0)
-- Dependencies: 168
-- Name: sms_send_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smssender
--

ALTER SEQUENCE sms_send_queue_id_seq OWNED BY sms_send_queue.id;


--
-- TOC entry 170 (class 1259 OID 39730256)
-- Name: sms_sent_history_counter_seq; Type: SEQUENCE; Schema: public; Owner: smssender
--

CREATE SEQUENCE sms_sent_history_counter_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sms_sent_history_counter_seq OWNER TO smssender;

--
-- TOC entry 1997 (class 0 OID 0)
-- Dependencies: 170
-- Name: sms_sent_history_counter_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smssender
--

ALTER SEQUENCE sms_sent_history_counter_seq OWNED BY sms_archive.counter;


--
-- TOC entry 1971 (class 2604 OID 39730261)
-- Name: counter; Type: DEFAULT; Schema: public; Owner: smssender
--

ALTER TABLE ONLY sms_archive ALTER COLUMN counter SET DEFAULT nextval('sms_sent_history_counter_seq'::regclass);


--
-- TOC entry 1963 (class 2604 OID 39730075)
-- Name: id; Type: DEFAULT; Schema: public; Owner: smssender
--

ALTER TABLE ONLY sms_send_queue ALTER COLUMN id SET DEFAULT nextval('sms_send_queue_id_seq'::regclass);


--
-- TOC entry 1987 (class 0 OID 39730258)
-- Dependencies: 171
-- Data for Name: sms_archive; Type: TABLE DATA; Schema: public; Owner: smssender
--

COPY sms_archive (counter, sms_id, ts_add_to_queue, ts_sent, status, sender_id, sender_name, receiver_id, receiver_name, receiver_phone_number, sms_contents, note) FROM stdin;
\.


--
-- TOC entry 1985 (class 0 OID 39730072)
-- Dependencies: 169
-- Data for Name: sms_send_queue; Type: TABLE DATA; Schema: public; Owner: smssender
--

COPY sms_send_queue (id, ts_add_to_queue, ts_sent, status, sender_id, sender_name, receiver_id, receiver_name, receiver_phone_number, sms_contents, note) FROM stdin;
\.


--
-- TOC entry 1998 (class 0 OID 0)
-- Dependencies: 168
-- Name: sms_send_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smssender
--

SELECT pg_catalog.setval('sms_send_queue_id_seq', 3762, true);


--
-- TOC entry 1999 (class 0 OID 0)
-- Dependencies: 170
-- Name: sms_sent_history_counter_seq; Type: SEQUENCE SET; Schema: public; Owner: smssender
--

SELECT pg_catalog.setval('sms_sent_history_counter_seq', 1775, true);


--
-- TOC entry 1979 (class 2606 OID 39730077)
-- Name: pk_sms_send_queue; Type: CONSTRAINT; Schema: public; Owner: smssender; Tablespace: 
--

ALTER TABLE ONLY sms_send_queue
    ADD CONSTRAINT pk_sms_send_queue PRIMARY KEY (id);


--
-- TOC entry 1981 (class 2606 OID 39730272)
-- Name: pk_sms_sent_history; Type: CONSTRAINT; Schema: public; Owner: smssender; Tablespace: 
--

ALTER TABLE ONLY sms_archive
    ADD CONSTRAINT pk_sms_sent_history PRIMARY KEY (counter);


--
-- TOC entry 1983 (class 2620 OID 39731780)
-- Name: move_sent_sms_from_queue_to_arch_trigger; Type: TRIGGER; Schema: public; Owner: smssender
--

CREATE TRIGGER move_sent_sms_from_queue_to_arch_trigger AFTER UPDATE OF status ON sms_send_queue FOR EACH ROW EXECUTE PROCEDURE move_sent_sms_from_queue_to_arch();


--
-- TOC entry 1982 (class 2620 OID 39730446)
-- Name: new_sms_in_queue_notify_trigger; Type: TRIGGER; Schema: public; Owner: smssender
--

CREATE TRIGGER new_sms_in_queue_notify_trigger AFTER INSERT ON sms_send_queue FOR EACH ROW EXECUTE PROCEDURE new_sms_in_queue_notify();


--
-- TOC entry 1994 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2013-06-11 15:25:39 CEST

--
-- PostgreSQL database dump complete
--

