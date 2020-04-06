FROM ubuntu:bionic-20191029

ENV DEBIAN_FRONTEND=noninteractive
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update -qq \
&& apt-get install --no-install-recommends --yes --force-yes -qq \
  curl \
  git \
  libffi-dev \
  make \
  python3-pip \
  python3-setuptools \
  python3-wheel \
  python3.8 \
  python3.8-dev \
> /dev/null

RUN rm -rf /usr/bin/python3
RUN ln -s /usr/bin/python3.8 /usr/bin/python3

# TODO: Replace this with a proper package manager
RUN pip3 install \
ipython \
jsonschema \
matplotlib \
numpy \
pyyaml \
requests \
schemapi \
scipy \
xlrd
